---
layout: layout.njk
title: Project 2 - Improving the security model of swhkd
---

# Improving the security model of swhkd

- **Mentors**: Aakash Sen Sharma
- **Student**: Ishan Joshi

Over the past few months, I have been working on a lot of different changes to the swhkd codebase.
Me and my mentor together have gone through various approachs that could be used to simplify the swhkd codebase
and also improve it's security model.
The journey has been thoroughly documented and ordered, including all of the mistakes that I made and the things that I learnt on
this site itself.
This changelog attempts to summarize all of the changes that have been made in the codebase and the reasons behind them.
This changelog will be mirrored over to a Github gist and will be submitted as the final report for the project.

## TL;DR

- The project was started with the goal of improving the security model of swhkd.
- An IPC based protocol was being used in the project to communicate between the main daemon that was in the root user space and a server that was in the user space.
- The root daemon was responsible for capturing the key events and the user daemon was responsible for executing the commands that were associated with the key events.
- This however was causing security concerns as documented by the various CVEs that were raised against the project.
- We finally came up with a solution using de-escalated thread based approach that would allow the daemon to execute the commands in the user space itself.

## The Problem

The problem with the current implementation of swhkd was that the daemon was running in the root user space and was executing the commands in the user space.
This was causing quite some security problem, the exact details of which can be found documented in the various CVEs that were raised against the project.
So the goal of the project was to come up with a solution that would improve upon the current IPC based model to something a bit more secure.

## Failed Approaches

### Internal ITC Model

Our initial idea was to replace the IPC model with an internal ITC(Inter Thread Communication) model.
This meant that the daemon could now spawn a thread in the userspace that could execute the commands in the user space itself.
However, a very important aspect that we had failed to guess was that since the daemon was running in the root space, it did not 
have access to the environment variables of the user space.
Environment variables are crucial to the execution of the commands as they contain important details like the
`DISPLAY`, `XAUTHORITY` and `WAYLAND_DISPLAY` variables that are required to execute the commands in the user space.

These environment variables were not being passed to the user space and hence the commands were failing to execute at all.
A lot of tries were made to pass the environment variables to the user space, but all of them failed.
However, this was a very important learning experience as it taught us that the environment variables are crucial to the execution of the commands.
Moreover, we also had written functions to get the current uid and the current user's username, which would be used in our `su` approach.

### Using `su`

While we were trying to pass the environment variables to the user space, we came across the `su` command, which allows you to switch the user
and execute a command in the user space.
We decided to use the `su` command to switch the user and execute the command in the user space itself.
However, we were still trobuled by the fact that the environment variables were not being passed to the user space.

So, to finally solve this, it was decided that instead of abondoning the IPC model, we would instead make the daemon
less reliant on the server and hence reduce the complexity of the whole exchange.
So now, the daemon would use `su` to execute the command in the userspace, but the server would merely act as an env beacon
that would provide the environment variables to the daemon.

This would mean that all of the CVEs that were raised against the project would effectively be mitigated
since even though the IPC protocol existed, it was now *emitting information* rather than acting as an execution medium.

So now, the daemon could request the server for the environment variables and then use `su` to execute the command in the user space.
This approach seemed to work flawlessly and the daemon was now able to execute the commands in the user space.

However, we ran into a problem in which when we use a setuid binary of the swhkd daemon, `su` was unable to 
authenticate and effectively de-escalate the privileges of the child process.
This was because since the setuid binary was now owned by the root user, `su` was recognizing the commands being executed by the daemon as root
and was refusing to de-escalate the privileges of the child process unless it was given the user's password.
This would not be possible for a hotkey daemon and hence we had to switch to a different approach.

## Threads, but with a twist

So we decided to switch back to the thread based approach that we had initially abandoned.
However, now that we had decided to get the `env` from the server, the thread based approach seemed to be a lot more viable since
it's main problem was now solved.

So the daemon would now spawn a thread that would be valid throughout the lifetime of the daemon.
A channel based approach was setup where all of the commands would be sent to the thread and the thread would execute them in the user space.
This was simple and effective and the daemon was now able to execute the commands in the user space.

So with this approach, we have all of the advantages that the server seperation provided us with (as mentioned above) and also the 
fact that it was working with both setuid and sudo / doas escalated binaries.

<video src="/vids/swhkd_demo_improved.mp4" autoplay muted></video>

## Daemonizing the server

The initial plan was to have the server run only once at the beginning and then shut down.
This was made to make sure that the server was not unnecessarily running all the time.
However, it was found that sometimes, this exchange could not account for any changes made to the env.
So it was decided that the server would instead be daemonized, with all of it's output redirected to `/dev/null`.
This way, the server would be persistent across the process life cycle and would act as a constant source of the environment variables.

The next challenge was to determine a resource efficient way to actually know when the daemon
should request for the environment variables in the first place.
We decided to use a simple event based cron job that the user can specifiy when launching the daemon.
The default timeout is 650ms, but the user can specify a custom timeout using the `-r` flag.
The 650ms timeout was chosen because it is related with the startup time of the server and the time it takes to get the env.

So with this, we have the env refresh well all set up.

## Changes made

It would be difficult to layout all of the changes made in the codebase in a single changelog, however,
the following are the major changes that can be easily noticable in the codebase.
For the full changes, please refer to the [Github repository](https://github.com/newtoallofthis123/swhkd/commits).

1. **Seperate Env Module**: [refer](https://github.com/newtoallofthis123/swhkd/commit/5e8ebe3b5fea6373bb119903a3fb9e1debb6133d):
All of the env parsing and feed has been categorized into a seperate module called `environ.rs`.
This module is responsible for parsing the environment variables and providing them to the daemon.
The env from the server is just a newline separated string of `key=value` pairs.
These are parsed, deduped and then fed to the daemon.

2. **Retire SWHKS command execution**: [refer](https://github.com/newtoallofthis123/swhkd/commit/d17315c72289540332f49023d10e91154f638532):
The `SWHKS` command execution has been retired and instead, the daemon now uses `su` to execute the commands in the user space.
This means that the daemon is now less reliant on the server and hence the security concerns are mitigated.

3. **Daemonize the server and env sending**: [refer](https://github.com/newtoallofthis123/swhkd/commit/415375e8c5bb9e0ca928e1d2808a16a5113d20f7): 
The server has been daemonized and all of it's output has been redirected to `/dev/null`.
Moreover, the actual function to send the env to the daemon has been added.
Any connection to the server now results in the server sending the env.

4. **Event based env refresh**: [refer](https://github.com/newtoallofthis123/swhkd/commit/50c624fb9bad4a3bed86a88520991eca2d899399):
The server now has an event based cron job that sends the env to the daemon every 650ms by default.
However, the user can specify a custom timeout using the `-r` flag.

5. **Config file better defaults**: [refer](https://github.com/newtoallofthis123/swhkd/commit/1aa0ff35b23ac6256d681058d29859e9057bd247):
The config file location now correctly defaults to `~/.config/swhkd/swhkdrc` thanks to the environ refresh from the server.
The problem was that the daemon was running in root space with the root user's env, so it was not able to find the config file
that was stored in the user space.
So, just for the config file location, the daemon now requests the server for the env and then uses `su` to read the config file.

6. **Channel Based Communication**: [refer](https://github.com/newtoallofthis123/swhkd/commit/c2655a403f79fbe10f5b15dcf08666e1e6e13b2a):
The daemon now uses a channel based communication to communicate with the thread.
The thread is spawned at the beginning and is valid throughout the lifetime of the daemon.
A mpsc channel of a good default of `100` is used to communicate between the daemon and the thread.
This means that the daemon can now execute the commands in the user space without spawning a new thread everytime.

7. **Server Instance Tracking:** [refer](https://github.com/newtoallofthis123/swhkd/commit/0d360dc9c51a3d61a951f3f623cd8e2a61e7ac7d):
The server now detects if it is already running and if it is, it doesn't start a new instance.
This is usefull because it has been daemonized and hence can be running in the background when a new connection is made.

## CVE's

The following CVE's were raised against the project:
CVE-2022-27815, CVE-2022-27814, CVE-2022-27819, CVE-2022-27818, CVE-2022-27817, CVE-2022-27816

The other CVE's were fixed in the previous patches and my code doesn't really change much about them.
However, the one I do want to address is the CVE-2022-27816, which reads as follows:

```text
The Unprivileged Server Process Receives Commands via /tmp/swhkd.sock
```

This is effectively mitigated by the new approach that we have taken. 
This is because the server now doesn't react in any way to the commands it recieves on the socket.
The server merely acts as a beacon for the environment variables.
This means that regardless of any command that is sent to the server, it only outputs the environment variables and nothing else.
Now it also doesn't matter is a malicious user sends a command to the server, since the server is not executing any commands, it 
is not vulnerable to any command injection attacks.
It is merely a source of the environment variables.

## Final Flow

The final flow of the daemon is as follows:
The daemon is launched in the root space and the server is launched in the user space.
This is reminiscent of the old IPC model as such:

```bash
./swhks && doas ./swhkd
```

The `doas` or `sudo` can be skipped by making the swhkd binary a setuid binary.
This can be done by running the following command:

```bash
sudo chown root:root swhkd
sudo chmod u+s swhkd
```

Right after this is done, the first connection to the server is made and the server sends the env to the daemon.
This information is stored in the `env` struct instance and this is exchanged and valid throughout the process life cycle.
The `XDG_CONFIG_HOME` is also set to `~/.config/swhkd` and the config file is read from there if it exists.
A thread is spawned that is valid throughout the lifetime of the daemon.
The thread is also de-escalated to the user space.
The thread can communicate with the daemon through a channel.

Next, the daemon starts listening for the key events.
When a key event is detected, the daemon just sends it to the thread through the channel.
Concurrently, there is a cron job that sends the env to the daemon every 650ms by default.
This ensures that the env is always fresh and the daemon can always execute the commands in the user space.

## Future Work

I plan on being involved with the project after the GSoC period ends.
Here are some of the future work that I would like to do on the project:

- The future work for the project would be to improve the daemon's UX further.
- The daemon currently does not have a lot of error handling and the error messages are not very descriptive.
- Figure out if `notify-send` can be used to send notifications to the user.
- Try adding tracing logs to the daemon to make it easier to debug.

## Conclusion

The project has been a very enriching experience and I have learnt a lot about IPC, security and the Rust programming language.
My code has also been annotated with proper comments and documentation to make it easier for anyone new to the project to understand it.
Google Summer of Code has been a very rewarding experience and I would like to thank my mentor for guiding me through the project and also
the waycrate community for being so welcoming and helpful.
