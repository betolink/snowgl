
Snow GL
=====================

Snow GL is a WebGL experiment to render a time series animation using satellite browse images.

### Running the app

Clone or download this repo and start a web server from there.

```
git clone https://github.com/betolink/snowgl && cd snowgl
python -m SimpleHTTPServer
```
> **NOTE:** You can use any web server available in your box, i.e. Apache, Node, NginX etc.

Now open your browser using the host:port on which you are running the web server.

### Notes

This demo uses [THREE.js](https://github.com/mrdoob/three.js/) on top of HTML5 3D Canvas, a compatibility matrix be seen [here](http://caniuse.com/#search=canvas)

Built with [Vanilla JS](http://vanilla-js.com/)

### TODO

* Dynamic image loading from NASA FTP servers.
* Multilayer animations.
* Improve texture loading performance to handle better resolution.
* Etc.

### License

(c) @betolink 2013

Licensed under WTFPL
http://www.wtfpl.net/txt/copying/