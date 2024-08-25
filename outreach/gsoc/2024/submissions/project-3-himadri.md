---
title: Project 3 - Formalize SWHKD parser using regular grammar notation
layout: layout.njk
---

# Overview

Hello and welcome to the final GSoC post for 2024! My task was to formalize the SWHKD parser using context-free EBNF notation. This post is to serve as a birdseye view of what
I have developed over this summer.

- **Mentors**: Aakash Sen Sharma
- **Student**: Himadri Bhattacharjee

# Report

## Architecting the parser

I started out with the scaffolding of the parser in an extended Backus-Naur form garmmar template
in a separate repository called [SWEET](https://github.com/waycrate/sweet) using a Rust framework
called [pest.rs](https://pest.rs). Quite a lot of time was
spent in modelling the architecture of the syntax tree for our domain specific language.

Here's a simplified syntax tree of the grammar parser.

![A flowchart showing the working of the abstract syntax tree](/assets/img/sweet-architecture.svg)

One of the most helpful design choices was to have an acyclic dependency graph which enabled composing
expressions into larger blocks.

## Isolating shorthands into separate expressions

Shorthands expressions inside curly braces which were previously parsed dynamically have now been moved
to work statically from the grammar side itself. This has two advantages:

- The matching of both comma separated _"slices"_ and dash separated _"ranges"_ can be proven from the grammar template itself.
- Due to the greedy token matching of EBNF, the negative lookaheads guarantee a finite number of tokens to match a slice or range.
- Extracting the components inside these blocks are performed in a single pass.

The latter is a theme that will continue throughout the rest of this report.

## Adopting static checks

Many of the earlier hand-rolled checks have now been moved to the grammar side and are now performed statically.
We are borrowing a concept from the Rust programming language itself which promotes making invalid states unrepresentable.

One such example is validating characters inside ranges. The specification requires these characters
to be within the ASCII range. We define this constraint inside the grammar template itself.

This way, if some invalid input is supplied, it never hits the business logic and the program errors out early.

## Separating channels of commands and mode instructions

SWHKD supports entering or escaping a mode by placing special instructions after the double ampersands between two commands.
Previously,
these instructions were extracted from the commands dynamically right before they were being run
line by line. This led to edge cases where the command being run is not what the user intended.

To sanitize this, we perform static extraction of these modes in the context of an entire block of
commands. We create a separate structure linked to a command structure that can hold arbitrarily many of these mode instructions
and the instructions are run only after all the command chunks have been executed.

## Unified shorthand syntax

This is one of the breaking changes introduced in the new parser.

Previously, when modifiers were
used inside shorthands, one could place the concatenator (plus sign) either outside or inside the
braces. This allowed somewhat off looking combinations like these:

```
{super, control + } + a
  notify-send {'hello', 'goodbye'}
```

This was allowed because the older parser simply ignored the concatenator, using the closing curly
brace as a confirmation for the end of a shorthand.

The new parser disallows this behavior. When using multiple modifiers, one must simply place an concatenator after the shorthand ends.
The above example then turns into the following:

```
{super, control} + a
  notify-send {'hello', 'goodbye'}
```

Now there's at most one way to do shorthands correct:
  - A shorthand must contain at least two variants. It makes no sense to use shorthands otherwise.
  - Any literal like a comma or a curly brace inside a shorthand must be escaped
  - Literals do not need to be escaped outside shorthand contexts.
  - Shorthands with omissions (underscore elements) must always have a concatenator appended to each non-empty element. For example, unlike `{control, super} + a`, in `{_, super + } a` adding a plus to `super` inside the shorthand is the only valid syntax.

A good comparison would be bash or Rust macro expansions. Here's an animation as to how we perform
a "compilation".

![An animation showing a cartesian product of shorthands](/assets/img/sweet-macro-compilation.gif)

The new parser simply keeps track of shorthand values including ranges and slices as long as it is
ingesting newer content. These shorthands are lazily evaluated in the end when all files, including
imports have been ingested.

## More human friendly errors

One of the most difficult ways to get a working config for a tool like SWHKD is the lack of helpful
errors. The new parser addresses most of these issues. With the pest crate, we have been able to
provide rich contextual errors. Here's an example:

```text
Error: unable to parse config file

Caused by:
      --> hotkeys.swhkd:20:11
       |
    20 | super + k + control
       |           ^---
       |
       = expected command
```

Instead of just printing what the error was, we try to help the user by letting them know about what
the parser expected, where in the source file does the error exists and any suggestion available to
fix the error.

This not only applies to the grammar errors but to all of the errors in the business logic. Here's an
example of when the number of shorthand variants in the trigger don't match the number of command variants.

```
Error: unable to parse config file

Caused by:
      --> 35:1
       |
    35 | super + {alt + , _, shift + } a
    36 |  notify-send 'hello'␊
       | ^------------------^
       |
       = the number of possible binding variants 3 does not equal the number of possible command variants 1.
```

Our custom error
structures wrap around pest's error types to provide such additional context as and when needed.

## Precautions

Before parsing any config files supplied as input, we perform the following sanity checks:

- Ensure that the files are within the predefined file-size capacity. This capacity can be configured
during compilation by modifying the `build.rs` file.
- Ensure the file being supplied is a regular file. This is a cautionary measure against an older [CVE-2022-27814](https://github.com/advisories/GHSA-x446-3xhq-5xfp).


# Relevant links

- Source tree for the parser: [waycrate/sweet](https://github.com/waycrate/sweet)
- PR to integrate `sweet` into `swhkd`: [#265](https://github.com/waycrate/swhkd/pull/265)

# Conclusion

Debugging a context free grammar syntax like EBNF was certainly challenging although this issue was solved
relatively easily thanks to the excellent editor provided at the [pest.rs](https://pest.rs) website. The parser
has reached complete feature parity, being slightly stricter in some cases as I
had planned with my mentor, Aakash Sen Sharma. Huge thanks to him for the helping me out with getting familiar
with the codebase quickly. The rest of the waycrate community has also been incredibly warm and welcoming.

I plan to add a heuristics model to SWHKD for detecting input devices better and more generally
to continue improving SWHKD. Feel free to check out the other posts on [my blog](https://lavafroth.is-a.dev/tags/google-summer-of-code) which go deeper into the process
of building this parser. This has been my GSoC 2024, thank you so much for reading this!
