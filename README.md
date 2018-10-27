# Jekyll Kubi

Jekyll Kubi is a Jekyll environment to develop and create a Jekyll site. It has taken inspiration from Shopify Kubi. The starter theme **Milkyway** that will go with Jekyll Kubi will be *coming soon*. Jekyll Kubi provides a easier and more powerful development solution to creating Jekyll dev environments and workflows.

Jekyll Kubi gives the ability to set up the project right from the terminal by running **kubimini**. The kubimini script will ask a series of questions such as the name of the main stylesheet and JavaScript file, as well as core information for _config.yml. Once the questions have been answered kubimini will proceed in building the project to your answers.

The config.yml is a **REQUIRED** file which must always remain. If any customisation is needed for the global project this is where you can achieve it. However, while in development you can use the subfile _config.dev.yml. This file allows is where you can customise Jekyll for the development enviornment (*Do not add any data required for production in this file*).

The project uses a number of different packages to achive it's compiling, minification and standards checking. It also comes with dependencies that you can use to enchance the project. You can find all the dependencies including those only for development within the **package.json**. These packages are completly optional but it is recommend you use some to help speed up the development process. The recommend packages are:

* [Bourbon](https://www.bourbon.io/docs/latest/)
* [Family](http://lukyvj.github.io/family.scss/)
* [jQuery](https://jquery.com/)
* [jQuery Migrate](https://github.com/jquery/jquery-migrate/#readme)
* [Include Media](https://include-media.com/)

For some of the available packages it is however, only recommend to include parts of them for example:

* [Hamburgers](https://jonsuh.com/hamburgers/)
* [Hover](http://ianlunn.github.io/Hover/)

Jekyll Kubi also gives the flexibility of allowing you to develop in multiple coding styles such as:

* Sass instead of SCSS
* JSON instead of YML/YAML
* LESS *(coming soon)* instead of SCSS
* Yarn, NPM or Bower

However even though the project allows for flexibility it also makes sure coding standards are kept and that Git is maintianed. When in the development environment your styling code will be scanned and linted to make sure it abides by it's languages standards for example if Sass it will run sass linting and if JavaScript it will run JSCS and ESLint linting. Styling will also be checked to see if the [BEM](http://getbem.com/) standards are used.

While developing you can set the project to either be team based or indivual based. If set to team Jekyll Kubi will run git before and after each Gulp task. If the the project isn't set to team then a Node Cron will run every two hours performing a git commit and push. In additon to these every fifteen minutes a reminder will popup asking you to do a git commit. This popup will run if the project is set to team or indivual. However, even though Jekyll Kubi will git commit and push for you it is still **highly recommend to do manual commits and pushes**. These commits and pushes **should** be done at least after every key stage with an appropriate message detailing what has been done. For example at the end of finsihing a hero module you would then perform a commit and push, with the message about what you have done with the hero module.

## Project Setup

To start using Jekyll Kubi first make sure you have Bundler and Jekyll installed and you have created your new repo. If you do not have Bundler or Jekyll insteall you can install them by running the following commands or use the Kubi CLI *(coming soon)*:

1. `gem update`
2. `gem install bundler`
3. `gem install bundler jekyll`

Once your new repo is created you will need to create the upstream to Jekyll Kubi or use Kubi CLI *(coming soon)*. To create the upstream, firstly make sure you are on the **master branch** and then run the following command from your local project folder:

```
git remote add upstream git@github.com:kubixmedia/jekyll-kubi.git
```

To find out more about upstreams, see the Github tutorial [https://help.github.com/articles/fork-a-repo/]. This tutorial will refer to forking but the steps of upstreaming are the same.

Once the upstream has been set up, you can then proceed with the setup process.

1. Run `git merge upstream/master && git add . && git commit -m"merged with upstream" && git push -u origin master`
2. Navigate to the terminal and type `sh kubimini.sh` to run the kubimini script and follow the instructions
3. Update your humans.txt
4. To run kubimini without typing *sh* you can run the command `chmod +x kubimini.sh` in the terminial

You can also setup Jekyll Kubi manually **(not recommended)** but you will need to run a few things first, before you dive stright into developing.

1. Run `git merge upstream/master && git add . && git commit -m"merged with upstream" && git push -u origin master`
2. Update `package.json` with your new repo details
3. Execute the command `npm install && bundle install`
4. Update the default the settings within `_config.yml` for the project
5. Check everything is setup correctly with your config.yml file and that all files such as `humans.txt` are correct and make sure all files do not reference the Jekyll Kubi project but only your new repo
6. Delete `CHANGELOG.md` and `README.md` files or change the README to give information about your new repo
7. Create a development branch to start developing `git checkout -b development && git push -u origin development`
8. Once everything looks good and you have followed the instructions you can how run Jekyll Kubi by typing `gulp`

Once the project is all setup you will notice two new folders within the standard Jekyll structure *_assets* and *_config*. These are the core folders to Jekyll Kubi. Without `_config` Jekyll would crumble! _config will contain the project's environment variables, Gulp config file, Gulp tasks and path locations for Gulp.

The `_assets` folder is where all your JS, styling, fonts and images go for development. When the files withing `_assets` get compiled they will go into Jekyll's folder `assets`. This can be looked at as the _assets folder is the **src** folder and the Jekyll assets folder is the **dist** folder. To achive automiatic browser reload each file within _assets gets put into the **_site** folder then into the **assets** folder. The reason for this structure is when Jekyll rebuild's itself it will clean the _site folder so any files just injected into there will be deleted each time Jekyll re-runs.

However Jekyll always looks for it's own asset folder which is why we also inject into there, then the files will stay. You may be thinking why not just create our files directly in assets? The reason why we don't do this is Jekyll has it's own compiler for SCSS, but this project uses Gulp. So we avoid the Jekyll compiling when putting our assets in **_assets**. The _assets folder can have it's own seperate subfolders.

Once development has finished you can run a test build to make sure everything works and is correct for the project to go into production. To run the test build execute the following command within your terminal:

```
gulp build:test
```
This will set the environment to production and check a new git branch called `build-testing`. All the Gulp tasks will then run in production mode. Once the tasks have built, testing will then be done to check the files. These tests include Markdown linting, accessibility checks and HTML proofing for errors, missing links etc. After the tests are complete the new branch will switch back to the development branch.

After passing the tests you can run the true build of the production by typing the command:

```
gulp build
```
Like the test command this will run all tasks in production however becuase you are telling Gulp the project is now **finished** the command instead of creating a new branch will checkout the master branch and perform a merge with development, ready for deployment. *Git deployment will soon be coming to Jekyll Kubi, so when `gulp build` is run it will also deploy the site to the required hosting*.

## Updating

There will be enchancements, bug fixes and funtionality improvements made to Jekyll Kubi over time. To update your Jekyll project to the latest Kubi you will need to run the commands:

1. `git fetch upstream` or `git checkout upstream/master && git pull master` then checkout out your project branch
2. `git merge upstream master`

## Contributing to Jekyll Kubi

If you would like to contribute to Jekyll Kubi, you should first consider if your change should be added to the project and be part of the Jekyll Kubi releases. If however, you do need to contribute to Jekyll Kubi, you should fork a copy, make the change and then submit a pull request.

### Releases

All changes either an enchancement or warrenting a new release **must** be done on the development branch or subbranches of development first before merging with master for the main release. All releases within development should be marked with the pre-release and have the code name of the release they are going to be or are linked to. For example `Release - Mercury`. If the changes are linked to an already released version then once the new releases name matches, make sure the version number is higher than the previous. Version numbers are done by tags. For example `Release - Mercury` tag `v1.0.1`.

You can find more out about releases here: https://help.github.com/articles/creating-releases/.