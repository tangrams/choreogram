function start_choreogram_client() {
    var socket = io(window.location.origin);
    socket.on('connect', function () {
        var channel = 'public';

        if (query['channel']) {
            channel = query['channel'];
        }

        socket.name = prompt("Please enter your name", socket.id);
        socket.emit('join', { channel: channel, scene: scene_url, mouse: {lat: 0, lng: 0}, draggin: "false", name: socket.name });

        map.on('drag', function () {
            socket.emit('view', { position: map.getCenter(), zoom: map.getZoom()})
        });

        map.on('mousemove', function (mouse) {
            socket.emit('mouse', mouse.latlng);
        });

        map.on('mousedown', function (mouse) {
            socket.emit('draggin', true);
        });

        map.on('mouseup', function (mouse) {
            socket.emit('draggin', false);
        });
        
        socket.on('position', function (msg) {
            map.setView(msg);
        });

        socket.on('zoom', function (msg) {
            map.setZoom(msg, { animate: false });
        });

        socket.on('view', function (msg) {
            map.setView(msg.position, msg.zoom);
        });

        socket.on('user_update', function (user, user_data) {
            var user_dom = document.getElementById(user);
            if (user_dom) {
                if (user_data.mouse) {
                    var latLng = new L.latLng(user_data.mouse.lat, user_data.mouse.lng);
                    var point = map.latLngToContainerPoint(latLng);
                    user_dom.style.left = point.x + 'px';
                    user_dom.style.top = point.y + 'px';
                }

                if (user_data.draggin) {
                    var marker = user_dom.getElementsByClassName('user_marker')[0];
                    marker.style.backgroundColor = 'green';
                } else {
                    var marker = user_dom.getElementsByClassName('user_marker')[0];
                    marker.style.backgroundColor = 'red';
                }
            } else {
                console.log('New user', user_data.name);
                var user_dom = document.createElement('div');
                user_dom.id = user;
                user_dom.innerHTML = '<div class="user_marker"></div><p class="user_label">'+user_data.name+'</p>';
                if (user_data.scene !== scene_url) {
                    user_dom.innerHTML += '&nbsp;<spline class="link">(<a class="link" href="'+window.location.origin+'/?channel='+channel+'&scene='+user_data.scene+'">'+(user_data.scene.split('\\').pop().split('/').pop().split('.'))[0]+'</a>)</spline>';
                }
                user_dom.className = 'user';
                document.getElementById('overlay').appendChild(user_dom); 
            }
        });

        socket.on('user_del', function (user) {
            console.log('User', user, 'just leave');
            var dom = document.getElementById(user);
            if (dom) {
                document.getElementById('overlay').removeChild(dom);
            }
        });
    });
}