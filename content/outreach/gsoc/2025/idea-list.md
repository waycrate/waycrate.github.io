---
title: GSoC 2025 cohort idea list
---

## Idea 1: Port Wayshot to use the [ext_image_capture_source_v1](https://wayland.app/protocols/ext-image-capture-source-v1#ext_image_capture_source_v1) protocol for safe and efficient screen capture

### Possible Mentors

- Aakash Sen Sharma <aakashsensharma@gmail.com>
- Ishan Joshi <joshiishan246890@gmail.com>

### Difficulty:
### Project Size:
### Skills: Rust, Linux Protocols

### Description:

The ext_image_capture_source_v1 protocol has recently been introduced to Wayland, providing a secure and standardized method for screen and top-level window capture.
Wayshot currently utilizes a custom DMA-BUF backend for high-performance screen capture. However, adopting the official protocol offers a safer and more robust solution.

This idea outlines the integration of the [ext_image_capture_source_v1](https://wayland.app/protocols/ext-image-capture-source-v1#ext_image_capture_source_v1) protocol into Wayshot.
Implementing this protocol will significantly enhance Wayshot's security and offer substantial benefits to users.
These include security features such as top-level usage notifications, multi-window selection, and improved overall security posture.

### Expected Outcomes

The primary outcome is the complete integration of the [ext_image_capture_source_v1](https://wayland.app/protocols/ext-image-capture-source-v1#ext_image_capture_source_v1) protocol into Wayshot, including porting core `libwayshot` functionality to leverage the new protocol

## Idea 2: Introduce Auto Reload and Validation to SWHKD config reader and parser.

### Possible Mentors

- Aakash Sen Sharma <aakashsensharma@gmail.com>
- Ishan Joshi <joshiishan246890@gmail.com>

### Difficulty:
### Project Size:
### Skills: Rust, IPC

### Description

Currently SWHKD only reads and parses the config at the start of the daemon and the server with no way to hot reload
the application to read the new config. This needs to be fixed by either introducing a way to reload the config reader modules in the daemon
or porting over the config reading functionality to SWHKS (server).

This would vastly enhance the UX and security by providing a seamless way to reload the config without restarting the daemon or server.

### Expected Outcomes

Implement reloading of the config reader modules in the daemon or porting over the config reading functionality to SWHKS (server) to
ensure that the application can dynamically update its configuration without requiring a restart.
