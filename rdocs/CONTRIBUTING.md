# Contributing Guidelines

*Pull requests, bug reports, and all other forms of contribution are welcomes and highly encouraged for everyone*

## Contents

- [Contributing Guidelines](#contributing-guidelines)
  - [Contents](#contents)
  - [Code of Conduct](#code-of-conduct)
  - [Asking Questions](#asking-questions)
  - [Opening an Issue](#opening-an-issue)
    - [Bug Reports](#bug-reports)
    - [Security Issues \& Vulnerabilities](#security-issues--vulnerabilities)
    - [Other Issues](#other-issues)
  - [Feature Requests](#feature-requests)
  - [Submitting Pull Requests](#submitting-pull-requests)
  - [Writing Commit Messages](#writing-commit-messages)
  - [Coding Standards](#coding-standards)
  - [Certificate of Origin](#certificate-of-origin)
  - [Ending it Off on a Good Note](#ending-it-off-on-a-good-note)

## Code of Conduct

Please review our [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing to this project. It is 
in effect at all times, and we expect it to be honored by everyone who contributes to this project.

## Asking Questions

If you have a question, please open an issue and tag it with the `question` label. We will do our best to
answer your question ASAP, but this is not guaranteed. If you have a question that is not directly related to
the project, please consider asking it somewhere else.

## Opening an Issue

If you have found a bug, security issue, or have a feature request you would like implemented, it would be best to
open an issue to discuss it. Before creating an issue, check if you are using the latest version of the project.
If you are not up-to-date, see if updating fixes your issue first.

### Bug Reports

A great way to contribute to the project is to send a detailed issue when you encounter any problems. We always appreciate
a well-written, thorough bug report.

When submitting a bug report, please make sure to address the following:
- **Review the documentation and Support Guide** before opening a new issue.
- **Do not open duplicate issues**: Search through existing issues to see if your issue has already been reported.
  - If you're issue exists, comment with any additional information you have.
  - You may simply add "I have this problem too" or a "+1" to the existing issue.
  - If you have additional information, please add it to the existing issue.
- **Prefer using [reactions](https://github.blog/2016-03-10-add-reactions-to-pull-requests-issues-and-comments/)**, not comments, if you simply want to "+1" an issue.
- **Full complete the issue with the provided issue template**:
  - The bug report template will guide you through the process of submitting a bug report.
  - The issue report template will help you provide the necessary information for us to help you.
  - Be clear, concise, and descriptive about your issue.
  - Provide as much information as possible, this includes:
    - Steps to reproduce the issue;
    - Stack traces;
    - Compiler errors;
    - Library versions;
    - OS versions;
    - Any other relevant information.
  - **Do not** include any sensitive information in your bug report.
- **Be patient**: We are all volunteers, and we will do our best to help you as soon as possible.
- **Use [GitHub-flavored Markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)**:
  - Especially when providing code snippets or logs.
    - Use triple backticks for code blocks (```) and syntax highlighting depending on the language.

### Security Issues & Vulnerabilities

Review our [Security Policy](./SECURITY.MD). **DO NOT** file a public issue for security vulnerabilities.

### Other Issues

If you have an issue that doesn't fall within the following categories:
1. Bug Reports;
2. Feature Requests;
3. Security Issues & Vulnerabilities;
4. or General FAQ;

Please open an issue and tag it with the `other` label. We may take more time to respond to these issues, 
but we will do our best to help you as soon as possible, as long as it is somewhat related to the 
project. If it is not related to the project, we may close the issue without further notice, or suggest
that you post the issue somewhere else.


## Feature Requests

Feature request are more than welcome! While we will consider all requests, we cannot guarantee that your
request will be accepted. If your idea is great, but out-of-scope for the current project, we may put
it on the back-burner for the future or suggest that you fork the project and implement it yourself. If you
are accepted, we cannot make any commitments regarding the timeline for the implementation and release of your
feature. However, you are always welcome to submit a pull request to help!

Some things to keep in mind when submitting a feature request:
1. Do not open a duplicate feature request.
2. Fully complete the provided issue template.
3. Be as detailed as possible in your description.
4. Provide examples of how the feature would be used.
5. Be precise about the proposed outcome of the feature.

## Submitting Pull Requests

We all love pull requests! Before [forking the repo](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) and 
[creating a pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests) for non-trivial 
changes, it is usually best to first open an issue to discuss the changes, or discuss your intended approach for solving the problem in the comments for an existing 
issue.

For most contributions, after your first pull request is accepted and merged, you will be 
[invited to the project](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-access-to-your-personal-repositories/inviting-collaborators-to-a-personal-repository) 
and given push access. 🎉

*Note: All contributions will be licensed under the project's license.*
- **Smaller is better**: Submit one pull request per bug fix or feature.
    - Pull requests should contain isolated changes for a single bug or feature.
    - Don't refactor or reformat code that is unrelated to your change.
    - It is better to submit many small pull requests than a single large one.
    - Enormous pull requests will take time to review, or may be rejected altogether.
- **Coordinate bigger changes**: For large changes, open an issue to discuss a strategy to maintainers.
    - This will help to ensure that your pull request is accepted.
    - Maintainers can help guide you through the process, or you can help them understand the problem.
- **Prioritize understanding over cleverness**: Write code that is clear and concise.
    - Remember that source code usually gets written once and read often. 
    - Ensure the code is always clear to the reader. 
    - The purpose and logic should be obvious to a reasonably skilled developer.
    - Avoid overly clever solutions that are difficult to understand.
    - If you must use a clever solution, ensure that it is well-documented.
- **Follow existing styles and conventions**: Ensure that your code follows the existing style and conventions.
    - Keep consistent with style, formatting, conventions and naming.
    - If you are unsure about the style, ask the maintainers.
    - If you are adding a new feature, ensure that it fits with the existing codebase.
- **Add documentation**: Always add documentation for new features or changes.
    - Documentation should be clear, concise, and easy to understand.
    - Documentation should be written in markdown format.
    - Documentation should be added to the `docs/` directory.
    - Documentation can also be within the code, but at a minimum.
- **Write tests**: Always write tests for new features or changes.
    - Tests should be written in the framework being used for the project.
    - Tests should cover all possible edge cases.
    - Tests should be added to the `test/` directory.
    - Tests should be run before submitting a pull request.

## Writing Commit Messages

Writing a good commit message is important, as it helps to communicate the context of a 
specific change to other developers. A good commit message should follow the following rules:
1. The first line should be a short description of the change;
2. Separate subject from body with a blank line;
3. Limit the subject line to 50 characters;
4. Capitalize the subject line (e.g. `Add feature` not `add feature`);
5. Do not end the subject line with a period;
6. Use the imperative mood in the subject line (e.g. `Add feature` not `Added feature`);
7. Wrap the body to about 72 characters;
8. Use the body to explain **why**, not *what* or *how*;
9. If the commit fixes an issue, reference it in the body (e.g. `Fixes #1`);
10. Separate the body from the footer with a blank line;

## Coding Standards

When contributing to this project, please follow the coding standards outlined in the project's
[CONTRIBUTING.md](./CONTRIBUTING.md) file. This will help to ensure that your code is consistent
with the rest of the project and will make it easier for the maintainers to review your code.

## Certificate of Origin

*Developer's Certificate of Origin 1.1*

By making a contribution to this project, I certify that:
> (a) The contribution was created in whole or in part by me and I
> have the right to submit it under the open source license
> indicated in the file; or
> 
> (b) The contribution is based upon previous work that, to the best
> of my knowledge, is covered under an appropriate open source
> license and I have the right under that license to submit that
> work with modifications, whether created in whole or in part
> by me, under the same open source license (unless I am
> permitted to submit under a different license), as indicated
> in the file; or
> 
> (c) The contribution was provided directly to me by some other
> person who certified (a), (b) or (c) and I have not modified
> it.
> 
> (d) I understand and agree that this project and the contribution
> are public and that a record of the contribution (including all
> personal information I submit with it, including my sign-off) is
> maintained indefinitely and may be redistributed consistent with
> this project or the open source license(s) involved.

## Ending it Off on a Good Note

If you are reading this, bravo to you for making it to the end! We appreciate 
your time and effort in reading this document, you are truly awesome! 🎉

To make sure that you have read this document and are following it as best as possible,
please include this emoji in your issue or pull request: 🦄.

Thanks again for your time and effort, to the moon and back cadets! 🚀
