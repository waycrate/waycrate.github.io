---
title: GSoC 2025 cohort idea list
---

## Idea 1: Introduce [ext_image_capture_source_v1](https://wayland.app/protocols/ext-image-capture-source-v1#ext_image_capture_source_v1) protocol support in Wayshot and improve security features

### Possible Mentors

- Aakash Sen Sharma (aakashsensharma [at] gmail.com)
- Ishan Joshi (joshiishan246890 [at] gmail.com)

### Difficulty: Hard
### Project Size: Large (350 Hours)
### Pre-requisite Skills: Rust, Wayland Protocols ( Optional )

### Description:

The ext_image_capture_source_v1 protocol has recently been introduced to Wayland, providing a standardized method for display and top-level window capture.
Wayshot currently supports CPU-based and GPU-based capture over wlr-screencopy protocol which is non-standard. Adopting the official protocol offers toplevel capture capabilities natively and improves the user experience.

This idea aims to introduce a new backend and turn the wlr backend into a legacy codebase for backwards compatibility.
Due to the existence of this standardized protocol, we can now also provide extra *security* to users and denote over dbus notifications when a particular app-id is being recorded by wayshot clients.

### Expected Outcomes

- Introduction of new standardized protocol and *security features* to denote when toplevels are recorded by clients.
- Integration of the same protocol to xdg-desktop-portal-luminous to enable standardized WebRTC streaming.

## Idea 2: Introduce libinput backend to SWHKD to improve keyboard detection and security heuristics

### Possible Mentors

- Ishan Joshi (joshiishan246890 [at] gmail.com)
- Aakash Sen Sharma (aakashsensharma [at] gmail.com)

### Difficulty: Medium
### Project Size: Medium (175 Hours)
### Skills: Rust

### Description

Currently SWHKD uses the linux kernel evdev module to read keyboards and has very simplistic heuristics for device detection that is not ideal and prone to errors.
Due to these heuristics SWHKD in some scenarios may capture kernel events from devices that are *NOT* meant to be grabbed.

Evdev also requires a very complex security model to work with to ensure proper execution and we hope libinput helps us resolve some of that.

This can be avoided by a more restricted libinput API and can significantly reduce code complexity.
This would also vastly enhance the UX of the project at the cost of reduced capabilities but that can be avoided by a feature flag during build time.

_PS: Due to space constraints we are unable to list out all the advantages & disadvantages of evdev. If you'd be interested in those details, feel free to contact the listed possible mentors._

### Expected Outcomes

- Introduction of new libinput API for improved UX

## Idea 3: Introduce RDP support into xdg-desktop-portal-luminous

### Possible Mentors

- Decodetalkers (chenhongtao12345678 [at] gmail.com)
- Aakash Sen Sharma (aakashsensharma [at] gmail.com)

### Difficulty: Medium-ish (leaning towards hard)
### Project Size: Medium (175 Hours)
### Skills: Rust

### Description

Xdg-desktop-portal-luminous is a high performance capture portal for wayland compositors that supports frame capture and gpu-copy based frame streaming. The goal of this idea is to introduce support for remote-desktop protocol to enable applications like teamviewer and anydesk to work seamlessly on wayland compositors using our custom portal backends.

This will improve adoption and UX, users will no longer need to depend on other portals for this particular usecase and all usecases can be consolidated into 1 portal.

### Expected Outcomes

- Introduction of RDP support to luminous portal.
