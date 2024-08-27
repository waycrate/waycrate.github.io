---
title: GSoC 2024 cohort idea list
---

## Idea 1: Introduce [DMA-BUF backend](https://wayland.app/protocols/wlr-export-dmabuf-unstable-v1) in Wayshot for high performance screen capture

### Possible Mentor(s)

- Zubair Mohammed <zubair.mh@protonmail.com>
- Aakash Sen Sharma <aakashsensharma@gmail.com>
- Angelo Fallaria <ba.fallaria@gmail.com>

### Difficulty: Hard
### Project Size: Large (350 hours)
### Skills: Rust

### Description:

Currently Wayshot performs image capturing and transformations through the CPU, causing bottlenecking.

This idea will implement a DMA-BUF backend and a client-side API for high performance image capturing and transformations on the GPU. The new backend and api should enable high performance streaming over applications like [OBS](https://github.com/obsproject/obs-studio) using [our custom desktop portal backend](https://github.com/waycrate/xdg-desktop-portal-luminous).

### Expected Outcomes

- Integration of a DMA-BUF backend into Wayshot that allows high-performance screen capture and possibly extend [xdg-desktop-portal-luminous](https://github.com/waycrate/xdg-desktop-portal-luminous)

---

## Idea 2: Reiterating SWHKD security model to achieve simpler UX

### Possible Mentor(s)

- Aakash Sen Sharma <aakashsensharma@gmail.com>
- Zubair Mohammed <zubair.mh@protonmail.com>
- Angelo Fallaria <ba.fallaria@gmail.com>

### Difficulty: Medium
### Project Size: Medium (175 hours)
### Skills: Rust

### Description:

The current privilege model for SWHKD is rough, it has led to security vulnerabilities and problems with adoption among the userbase.

Solving this problem can be approached in two ways. Use a different program architecture, removing the current server-client architecture; Or use linux permissions more efficiently.

Aiming to gain access to hardware safely and efficiently, this idea plans to replace the current privilege model with a simpler and robust system.

### Expected Outcomes

- Improve the UX of SWHKD while minimizing friction for transitions to the new model
- SWHKD security API model mitigates more security issues than before


---

## Idea 3: Formalize SWHKD parser using regular grammar notation

### Possible Mentor(s)

- Angelo Fallaria <ba.fallaria@gmail.com>
- Zubair Mohammed <zubair.mh@protonmail.com>
- Aakash Sen Sharma <aakashsensharma@gmail.com>

### Difficulty: Medium
### Project Size: Medium (175 hours)
### Skills: Rust

### Description:

The current SWHKD parser has been hand-rolled. The parser has poor error messages and a host of bugs breaking valid usecases, culminating in bad user experience.

With the goal of improving user experience and bug fixing, this idea plans to introduce a new parser with robust DSL rules by defining a formal grammar.

### Expected Outcomes

- Create a new parser with proper parsing techniques
- Create EBNF grammar for the configuration language
- Write comprehensive unit tests for the new parser
