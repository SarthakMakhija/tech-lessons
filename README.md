## Introduction

[tech-lessons.in](https://tech-lessons.in/) is now a [hugo](https://github.com/SarthakMakhija/tech-lessons-hugo-theme) theme. This repository is now a readonly repository.

[tech-lessons.in](https://tech-lessons.in/) is a [Jekyll](https://jekyllrb.com/) based blog and this repository is a Jekyll theme forked from [https://github.com/sylhare/Type-on-Strap](https://github.com/sylhare/Type-on-Strap).

## Installation & Usage

    bundle install

    # See blog locally on port 4000
    bundle exec jekyll serve

    # See blog locally on port 4000 (with drafts)
    bundle exec jekyll serve --draft

    # Command used by Github to build. Use this to verify if there are any errors
    bundle exec jekyll build --safe

## Publish to Github Pages

    # Creates a local gh-pages branch which will contain only the assets that need to be published
    bundle exec rake site:publish

    # Switch to this new branch
    git checkout gh-pages

    # FORCE Push the gh-branch to MASTER branch of your github.io repository assuming the remote name is 'website'
    git push website gh-pages:master --force

    # Once successfully published, tag the current branch
    git checkout -b gh-pages-release-x

    # Delete the local gh-pages branch.. since we don't need it anymore
    git branch -D gh-pages

    # Push backup to github
    git push origin gh-pages-release-x


## Jekyll Related Links

+ [Jekyll From Scratch - Getting Started] (http://pixelcog.com/blog/2013/jekyll-from-scratch-introduction/)
+ [Jekyll Configuration options] (http://jekyllrb.com/docs/configuration/)
+ [Configuring Go Daddy with your domain to point to Github pages] (http://andrewsturges.com/blog/jekyll/tutorial/2014/11/06/github-and-godaddy.html)
+ [Understanding difference between master and gh-pages](http://octopress.org/docs/deploying/github/)

## Website Repository

+ [tech lessons repository](https://github.com/SarthakMakhija/sarthakmakhija.github.io) 

## Thanks

+ This theme was forked from [https://github.com/sylhare/Type-on-Strap](https://github.com/sylhare/Type-on-Strap). Thank you!
+ Referenced [Gurpreet's README.md](https://github.com/gsluthra/my_blog/blob/master/README.md). Thank you!
+ Thank you [Swapneel](https://github.com/swapneeldesai) for helping with the website theme. Thank you!
