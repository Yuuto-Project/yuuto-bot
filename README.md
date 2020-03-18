# yuuto-bot <!-- omit in toc -->

_If you are interested in joining the project as a developer, please take the time to check out Yuuto project's [website](https://iamdeja.github.io/yuuto-docs/)._

Yuuto bot is meant to be a collaboration of the [Official Camp Buddy Fan Server](https://discord.gg/hh2xDTV) members, completely community driven and open source. The bot's idea came from an increasing number of tech-oriented campers asking to see or contribute to _Super Hiro_ (the server's custom administrative bot).  
The following documentation contains information about the whole collaborative process, as well as guidelines for developers to get everyone started from the same base. For any questions that may arise, join the [development server](https://discord.gg/fPFbV8G) or ping _Dé-Jà-Vu#1004_ in the CB server.

> **Note:** to start working on the bot, do not clone _master_, clone _develop_ instead. (read: [git flow](#workflow))

You can clone the _develop_ branch with:

```bash
git clone -b develop --single-branch https://github.com/Yuuto-Project/yuuto-bot.git
```

or

```bash
git clone -b develop --single-branch git@github.com:Yuuto-Project/yuuto-bot.git
```

The first command clones over HTTPS, the second one over SSH, thus requiring you to set up a key. Either command will clone the _develop_ branch **only**.

## Contents <!-- omit in toc -->

- [Project Setup](#project-setup)
  - [Bot application](#bot-application)
  - [Why JavaScript](#why-javascript)
  - [Development](#development)
- [Development Server](#development-server)
  - [Bots](#bots)
  - [Channels](#channels)
  - [Testing channels](#testing-channels)
  - [.env](#env)
- [Workflow](#workflow)
  - [Master branch - Yuuto](#master-branch---yuuto)
  - [Release branch - BabyShark](#release-branch---babyshark)
  - [Develop branch - BeachBall](#develop-branch---beachball)
  - [Feature branches - self-hosted](#feature-branches---self-hosted)
- [Code Style](#code-style)
  - [JS ES11, Node v13](#js-es11-node-v13)
  - [ESlint & Prettier](#eslint--prettier)
  - [End of Line](#end-of-line)
  - [Commenting](#commenting)
  - [Commit messages](#commit-messages)

## Project Setup

The Yuuto bot will be written in JavaScript and the repository hosted on GitHub, as this seemed the best way to make the project accessible and easy for our campers to chip in on.

### Bot application

The bot is developed using JavaScript, following the ES11 standards. It is run on Node v13+ and uses Discord.js v12.0.1.  
Once you have cloned the repository on your local machine, make sure to download / update the packages from `package.json` if you haven't, as they will be needed in development.

### Why JavaScript

JavaScript was chosen, as the Discord.js library is outstanding, with a lot of excellent resources, tutorials, and the language itself being "easier" to pick up and work with than say C#, which also has an incredible Discord library.  
JS was also favoured over some other popular bot languages for many convenience reasons. Python is widely used but its asynchronous modes aren't as convenient to implement and the Discord library itself is subpar, Ruby it more of a niche language and Java suffers from the same complexity requirements as C#.

### Development

Yuuto bot has its own development server, you can join it by clicking [here](https://discord.gg/fPFbV8G). The server is the official means of discussion and collaboration on the bot, together with GitHub's collaboration tools.

## Development Server

The development server is the place where the campers can interact and test the bot, as for many it might be easier than to work with GitHub's integrated tools and branches. The server also makes use of webhooks to make integration with GitHub even simpler.

> **Note**: the development server shall remain strictly safe for work and no explicit content will be tolerated. Devs might be wanting to work in public spaces such as work / university / school, and this rule is in place in order to be considerate towards them.

### Bots

To test the code in a unified environment, multiple bots will be in the server.  
_BeachBall_ is the official development bot that runs the code in the _develop_ branch. Once a user pushes code to the _develop_ branch, the bot is automatically updated. _BabyShark_ is a bot that is only active when code is ready to be released to Yuuto. _Backend_ is an administrative bot doing under the hood work that one should pay no mind to, such as deployment server and git integrations.

For _feature_ branches, each camper / developer is welcome and encouraged to add their own testing bot to the server and using it in conjunction with the feature-testing channels to develop it. This lightens the load on BeachBall and gives you more control of the bot such as viewing console logs or starting it up / shutting it down.

### Channels

The development server is split into different categories, which are:

- informative: channels containing official updates and webhooks,
- general: general discussion channels,
- development: channels containing development tasks and discussions, also a great place to ask for help,
- testing: different channels that are used for testing purposes.

### Testing channels

Testing channels are categorised based on the project branch they should be used in conjunction with (more detail in [git flow](#workflow)).

- release-testing: will only be activated to give a final test to the bot before the code is deployed
- development-testing: general testing of the code in the _develop_ branch
- feature-testing-x: branches to test bots in feature branches
- special-channel-x: channels corresponding to specific channels in the CB server

### .env

Since some commands might be role or channel specific, and these IDs differ between the CB server and the development server, _environment variables_ should be used in code when locking features to specific IDs.  
This way, all that needs to be different for the feature + BeachBall bots and Yuuto bot is the `.env` file located on disk, while the code can stay the same and be directly implemented without any modifications from _release_ branch.

## Workflow

To keep the project smooth and running, it is important to have a rigorous development process and a standardised way of doing things.

The following sections contain information about branches, and how they should be treated. If you aren't familiar with how to work with git, please familiarise yourself with its basics, and remember to ask for help from other devs should you need to. Proper git workflow and usage is crucial for the smooth operation of the project.

> **Note:** more in-depth documentation/help available on the [Yuuto Docs](https://iamdeja.github.io/yuuto-docs/kb/yuuto-flow/).

### Master branch - Yuuto

The _master_ branch is the most important branch and the one that contains the running code of Yuuto. This branch is protected and nobody, not even the maintainers can push code to it directly. The only way code can make its way to the _master_ branch, is when _release_ gets merged with it by a maintainer.

### Release branch - BabyShark

The _release_ branch is a branch based off _develop_ branch, and any additions to it should only contain bug fixes, quality improvements and final polishes. This branch is created once enough or noticeable features on _develop_ get finalised, and it is time to deploy them to Yuuto. The code in the _release_ branch is ran by BabyShark. Once a maintainer merges _release_ with _master_, the branch gets deleted.

Work can continue on the _develop_ branch and other branches while _release_ is being worked on, and the auditing of _release_ might take time due to external factors. After the branch is deleted, work will resume as previously, and BabyShark will be toggled off.

### Develop branch - BeachBall

The _develop_ branch is the main development branch of Yuuto and the one that BeachBall is running. It is also the branch you should clone when you first join the project, as _feature_ branches will be based off it. When code is merged to this branch, BeachBall will automatically update itself to run it. Why merged? Because much like _master_, _develop_ gets updated by merges via pull requests. Force pushes to the development branch are possible, however they should be used only to update already existing core bot files in cases of important patches.

> **Note:** BeachBall is configured to restart itself if possible and thus permanent crashes are unlikely. However, depending on the severity of the issue, permanent crashes may still occur.

### Feature branches - self-hosted

The _feature_ branches should be the main working branches for developers, and code on the _feature_ branch a dev is currently working on should be hosted by themselves to allow for maximum flexibility. A new branch should be created for each new feature added and in the following format: `feature/featurename`. If the feature you want to work on already has a branch, devs should work on it together instead of creating spin-offs. If a spin-off must be crated, the following name format should be used: `feature/featurename-var[x]`, where `x` is the incremental variation number (starting with 1).

Once you or the devs working on the branch deem the feature to be complete enough for deployment to BeachBall, the _feature_ branch merge with the _develop_ branch should be initiated via a pull request.

## Code Style

When working as a team, it is important to make working with one another's code as pleasant as possible. Therefore, consistency is required, and some practices should be followed by all devs so ensure smooth teamwork and code integrity.

### JS ES11, Node v13

The current ECMAScript version is ECMAScript 2020 / ES11. All code written should be in-line with the best practices considered for ES11, however this mostly means adopting post ES6 syntax and practices. The major practices to follow are the usage of arrow functions unless `this` is needed and making use of the destructuring operator.

The bot runs on Node.js `v13.9.0`, but any version that is v13+ can be used on your local machine to run the code. It is important to note that the bot also uses the `esm` module loader instead of `cjs`, therefore usage of ES6 modules and imports is required, or the code will not run.

The reason why bleeding edge code and features are being run on node, is that promoting obsolete code and practices is both limiting and harmful in the long run. This is especially true for any newer JS programmers who might be using this project as an opportunity to learn and develop their skills.  
Even as a seasoned programmer, if you're still following legacy habits, see this as an opportunity to improve and keep yourself up to date with new standards, if you aren't already doing so.

### ESlint & Prettier

To make the code style as consistent as possible and making the project easier to maintain, ESlint and Prettier rules are enforced on this project. You should not touch the configuration files included within the repository, and you shouldn't override them with your own user files either, as a team cannot work with everyone having their own code aesthetic.  
If the linter is giving you issues that you disagree with and doing things differently isn't an option, use file-based rule-disabling. The issue can then later be discussed as a team and the rule added to the configuration files or the snippet itself being rewritten.

### End of Line

Throughout the whole project, all files should be using the _LF_ end of line separators, which is standard for Unix and macOS systems. On Windows, the default line ending is CRLF, in which case you should configure your editor to use LF line separators for the project files.

### Commenting

Your code should be well documented and commented. It is not necessary to comment every single function, loop, variable, ... however if the purpose of a piece of code isn't immediately clear from the naming or trivial function, some form of documentation is expected. People of various coding backgrounds, skill levels and programming styles may work together on this project, and poor documentation or assumptions about the understanding of others are not viable.  
In addition, the maintainers will have to audit the code before it is merged to _master_, and all obscure or undocumented code will be refused, no questions asked, until properly documented.

### Commit messages

No specific git commit message style is set in place and you are free to name your commits however you want, however your commit messages should still be informative and carry the essence of the commits. Any purposeful trolling or lazy commits will not be tolerated.
