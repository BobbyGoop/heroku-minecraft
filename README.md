# Heroku Minecraft Buildpack

This is a [Heroku Buildpack](https://devcenter.heroku.com/articles/buildpacks)
for running a Minecraft server in a [dyno](https://devcenter.heroku.com/articles/dynos). This repo was originally copied from [jkunter/heroku-buildpack-minecraft](https://github.com/jkutner/heroku-buildpack-minecraft)

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Usage

Create a [free ngrok account](https://ngrok.com/) and copy your Auth token, as it's needed for creating a tcp tunnel between the Heroku server and Ngrok. Then, create a new Git project with a `eula.txt` file and a `system.properties` file, which will specify the JRE version, needed for Minecraft launch (i.e version 1.18.1 needs JRE 17). Also don't forget about `requirements.txt`, as this buildback uses some code in python and requires Python buildpack.
> Additionally, you can also add a `server.properties` file, which wil configure Minecraft server.  This is how you would set things like
Creative mode and Hardcore difficulty. Example can be found [here](https://minecraft.fandom.com/wiki/Server.properties)

```sh-session
$ echo 'eula=true' > eula.txt
$ echo 'java.runtime.version=17' > system.properties
$ echo 's3cmd' > requirements.txt
$ git init
$ git add eula.txt
$ git commit -m "first commit"
```
You can add files such as `banned-players.json`, `banned-ips.json`, `ops.json`,
`whitelist.json` to your Git repository and the Minecraft server will pick them up.
However, they will still be created by Minecraft.

Then, install the [Heroku CLI](https://cli.heroku.com/).
Create a Heroku app and set your ngrok token:

```sh-session
$ heroku create
$ heroku buildpacks:add heroku/python
$ heroku buildpacks:add heroku/jvm
$ heroku buildpacks:add https://github.com/BobbyGoop/heroku-minecraft
$ heroku config:set NGROK_API_TOKEN="xxxxx"
```
## Syncing to S3 (additional)

The Heroku filesystem is [ephemeral](https://devcenter.heroku.com/articles/dynos#ephemeral-filesystem),
which means files written to the file system will be destroyed when the server is restarted.

Minecraft keeps all of the data for the server in flat files on the file system.
Thus, if you want to keep you world, you'll need to sync it to S3.

First, create an [AWS account](https://aws.amazon.com/) and an S3 bucket. Then configure the bucket
and your AWS keys like this:

```
$ heroku config:set AWS_BUCKET=your-bucket-name
$ heroku config:set AWS_ACCESS_KEY=xxx
$ heroku config:set AWS_SECRET_KEY=xxx
```

The buildpack will sync your world to the bucket every 60 seconds, but this is configurable by setting the `AWS_SYNC_INTERVAL` config var.
## Customizing (additional)

### Ngrok options

You can customize ngrok by setting the `NGROK_OPTS` config variable if you have a non-free account, which will allow you to use custom domain for the server. For example:

```
$ heroku config:set NGROK_OPTS="--remote-addr 1.tcp.ngrok.io:25565"
```

### Minecraft version

You can choose the Minecraft version by setting the MINECRAFT_VERSION like so:

```
$ heroku config:set MINECRAFT_VERSION="1.18.1"
```
Default version is usually the latest and can be found in [etc/files.json](etc/files.json)

## Launching
Finally, push all files to heroku repo and open the app:

```sh-session
$ git push heroku master
$ heroku open
```

This will display the ngrok logs, which will contain the name of the server
(really it's a proxy, but whatever):

```
Server available at: 0.tcp.ngrok.io:17003
```

Copy the `0.tcp.ngrok.io:17003` part, and paste it into your local Minecraft app
as the server name.

## Connecting to the server console

The Minecraft server runs inside a `screen` session. You can use [Heroku Exec](https://devcenter.heroku.com/articles/heroku-exec) to connect to your server console.

Once you have Heroku Exec installed, you can connect to the console using

```
$ heroku ps:exec
Establishing credentials... done
Connecting to web.1 on ⬢ lovely-minecraft-2351...
$ screen -r minecraft
```

**WARNING** You are now connected to the Minecraft server. Use `Ctrl-A Ctrl-D` to exit the screen session.
(If you hit `Ctrl-C` while in the session, you'll terminate the Minecraft server.)

If you cannot open screen session, this probably means that JRE could not run the minecraft server jar properly, so it's better to check what java version it uses.