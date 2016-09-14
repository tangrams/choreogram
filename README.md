![](imgs/nsync.jpg)

# Choreogram: tangram's in sync

Connect one or more tangrams together, to see the same position at the same time with another persons (or your self if you want to debug two styles together).

![](imgs/01.gif) 

## Install and Run

Clone the repository and install the dependencies

```bash
git clone https://github.com/tangrams/choreogram.git
cd choreogram
./choreogram install
```

Then run the server (a **http server** together with the **socket.io server**):

```bash
./choreogram start
```

Will ask for your **root password** to run the server in the port `80`. 

**Note**: If don't feel confortable doing that, change the port to `8080 in` ```server.js``` and lunch the server as `node server.js` with no super user powers.

## Use

This service is design to be flexible so most of the interface is throught the following **query parameters**:

= `channel=[channel_name]`: by default the channel room is call `public` but you can create your others.
- `scene=[url]`: the scene file to load
- `quiet`: hides attribution and UI
- `noscroll`: disables scrolling for iframe embedding
- `lib=[tangram_version_number]`: Tangram version number, defaults to 0.9
- `debug`: Tangram build, when this is not present defaults to min
- `gist=[url]`: url of a github gist saved from Tangram Play

This flexibility will allow you to re use this tools for different porposes, like debuging or comparing multiple tangram styles.

![](imgs/02.gif)

## Examples

* [Default](http://54.209.68.133/)
* [Blueprint](http://54.209.68.133/?scene=https://raw.githubusercontent.com/tangrams/tangram-sandbox/gh-pages/styles/blueprint.yaml)
* [Matrix](http://54.209.68.133/?scene=https://raw.githubusercontent.com/tangrams/tangram-sandbox/gh-pages/styles/matrix.yaml)
* [Tron 1.0](http://54.209.68.133/?scene=https://raw.githubusercontent.com/tangrams/tangram-sandbox/gh-pages/styles/tron.yaml) or [Tron 2.0](http://54.209.68.133/?scene=https://tangrams.github.io/tron/tron.yaml)

## Thanks to

* [Brett Camper](https://twitter.com/professorlemeza), [Peter Richardson](https://twitter.com/meetar) and [Lou Huang](https://twitter.com/saikofish) for [tangram-frame](https://github.com/tangrams/tangram-frame) wich the client is build on top.

