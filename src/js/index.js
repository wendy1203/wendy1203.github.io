$(function (param) {

    var renderer, camera, scene;
    var shadowCameraHelper, lightHelper, controls;
    var fov, near, far, cameraz, moveSpeed;
    var mouse = new THREE.Vector2();
    var raycaster = new THREE.Raycaster();
    var imgsArr = [
        "src/img/001.jpg",
        "src/img/002.jpg",
        "src/img/003.jpg",
        "src/img/004.jpg",
        "src/img/005.jpg",
    ];

    var imgsArr2 = [
        "src/img/006.jpg",
        "src/img/007.jpg",
        "src/img/008.jpg",
        "src/img/009.jpg",
        "src/img/010.jpg",
    ];

    initVr();

    function initVr() {
        initScene();
        initThree();
        initCamera();
        initLight();
        // initControl();
        initCeiling();
        initfloor();
        initWall();
        initImgs();
        initModel();
        initMouse();
        animate();
        $("#imgclose").click(function () {
            $("#img-box").hide();
            window.addEventListener('mousemove', onMouseMove, false);
            window.addEventListener('mousewheel', onMouseWheel, false);
            camera.position.set(0, 0, cameraz)
            camera.lookAt(0, 0, 0);
        })
    }

    function initThree() {
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        $("#canvas-vr").append(renderer.domElement);
        renderer.setClearColor('#605F5B', 1.0); //背景
        //告诉渲染器需要阴影效果
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 这个清晰 THREE.PCFShadowMap
    }

    function initControl() {
        controls = new THREE.OrbitControls(camera, renderer.domElement);

        var axes = new THREE.AxisHelper(10);
        scene.add(axes);
        // 如果使用animate方法时，将此函数删除 
        //controls.addEventListener( 'change', render ); 

        // 使动画循环使用时阻尼或自转 意思是否有惯性 

        controls.enableDamping = true;

        //动态阻尼系数 就是鼠标拖拽旋转灵敏度 

        //controls.dampingFactor = 0.25; 

        //是否可以缩放 

        controls.enableZoom = true;

        //是否自动旋转 

        controls.autoRotate = false;

        //设置相机距离原点的最远距离 

        controls.minDistance = 200;

        //设置相机距离原点的最远距离 

        controls.maxDistance = 100000;

        //是否开启右键拖拽 

        controls.enablePan = false;

    }

    function initCamera() {
        cameraz = 2000;
        fov = 50; //拍摄距离
        near = 1; //最小范围
        far = 5000; //最大范围

        camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far);
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = cameraz;

        camera.up.x = 0;
        camera.up.y = 1;
        camera.up.z = 0;
        camera.lookAt(0, 0, 0);

    }

    function initScene() {
        scene = new THREE.Scene();

        // var axes = new THREE.AxesHelper(100);
        // scene.add(axes);
    }

    function initLight() {
        var pz = 1600;
        var pz2 = 700;
        var ambientLight = new THREE.AmbientLight(0x404040); // soft white light
        scene.add(ambientLight);
        for (var i = 0; i < 6; i++) {
            var pointLight = new THREE.PointLight(0xfffcf3, 2, 605);
            pointLight.position.set(0, 200, pz - pz2 * i);
            scene.add(pointLight);
            // lightHelper = new THREE.PointLightHelper(pointLight, 1);
            // scene.add(lightHelper);
        }
        for (var i = 0; i < 2; i++) {
            var pointLight = new THREE.PointLight(0xfffcf3, 2, 605);
            pointLight.position.set(0 + 700 * i, 300, -2500);
            scene.add(pointLight);
        }

        // for (var i = 0; i < 5; i++) {
        //     var targetbox = new THREE.Object3D();
        //     targetbox.position.set(300, -140, pz - pz2 * i);
        //     scene.add(targetbox);

        //     var spotLight = new THREE.SpotLight(0xffffff);
        //     spotLight.position.set(10, 320, pz - pz2 * i);
        //     spotLight.distance = pz;
        //     spotLight.angle = Math.PI / 6;
        //     spotLight.decay = 1.7;
        //     spotLight.penumbra = 0.3;

        //     spotLight.castShadow = true; //需要开启阴影投射
        //     spotLight.target = targetbox;
        //     scene.add(spotLight);
        // }

        // for (var j = 0; j < 5; j++) {
        //     var targetbox = new THREE.Object3D();
        //     targetbox.position.set(-300, -140, pz - pz2 * j);
        //     scene.add(targetbox);

        //     var spotLight = new THREE.SpotLight(0xffffff);
        //     spotLight.position.set(-10, 320, pz - pz2 * j);
        //     spotLight.distance = pz;
        //     spotLight.angle = Math.PI / 6;
        //     spotLight.decay = 1.7;
        //     spotLight.penumbra = 0.3;

        //     spotLight.castShadow = true; //需要开启阴影投射
        //     spotLight.target = targetbox;
        //     scene.add(spotLight);
        // }

        // lightHelper = new THREE.SpotLightHelper(spotLight);
        // scene.add(lightHelper);
        // shadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
        // scene.add(shadowCameraHelper);
    }

    function initModel() {
        var z1 = 1600;
        var distance = 700;
        var loader = new THREE.OBJLoader();
        var geometry = new THREE.PlaneGeometry(90, 153);
        var white = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide
        });
        for (var i = 0; i < 5; i++) {
            (function (e) {
                loader.load("src/model/file.obj", function (loadedMesh) {
                    var material = new THREE.MeshPhongMaterial({
                        color: 0x605F5B
                    });

                    // 加载完obj文件是一个场景组，遍历它的子元素，赋值纹理并且更新面和点的发现了
                    loadedMesh.children.forEach(function (child) {
                        child.material = material;
                        child.geometry.computeFaceNormals();
                        child.geometry.computeVertexNormals();
                    });
                    loadedMesh.rotation.y = 0.5 * Math.PI;
                    loadedMesh.scale.set(0.6, 0.8, 0.9);
                    loadedMesh.position.set(160, -150, z1 - distance * e);
                    scene.add(loadedMesh);
                    var zhuomian = new THREE.Mesh(geometry, white);
                    zhuomian.rotation.x = 0.5 * Math.PI;
                    zhuomian.position.set(160, -90, z1 - distance * e);
                    scene.add(zhuomian);

                });
            })(i)
        }
        for (var i = 0; i < 5; i++) {
            (function (e) {
                loader.load("src/model/file.obj", function (loadedMesh) {
                    var material = new THREE.MeshPhongMaterial({
                        color: 0x605F5B,
                        side: THREE.DoubleSide
                    });
                    // 加载完obj文件是一个场景组，遍历它的子元素，赋值纹理并且更新面和点的发现了
                    loadedMesh.children.forEach(function (child) {
                        child.material = material;
                        child.geometry.computeFaceNormals();
                        child.geometry.computeVertexNormals();
                    });
                    loadedMesh.rotation.y = 0.5 * Math.PI;
                    loadedMesh.scale.set(0.6, 0.8, 0.9);
                    loadedMesh.position.set(-160, -150, z1 - distance * e);
                    scene.add(loadedMesh);
                    var zhuomian = new THREE.Mesh(geometry, white);
                    zhuomian.rotation.x = 0.5 * Math.PI;
                    zhuomian.position.set(-160, -90, z1 - distance * e);
                    scene.add(zhuomian);
                });
            })(i)
        }

    }

    //天花板
    function initCeiling() {
        var w = 101;
        var h = w / 1.3;
        var geoCeiling = new THREE.BoxGeometry(w, h, 3);
        var geoLight = new THREE.BoxGeometry(w, h, 3);
        var loader = new THREE.TextureLoader();
        loader.load("src/img/ceiling.png", function (texture) {
            var material = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide
            });
            for (var i = 0; i < 120; i++) {
                for (var j = 0; j < 16; j++) {
                    var ceiling = new THREE.Mesh(geoCeiling, material);
                    ceiling.receiveShadow = true;
                    ceiling.position.set(700 - w * j, 160, 2200 - h * i);
                    ceiling.rotation.x = 0.5 * Math.PI;
                    ceiling.rotation.z = 1 * Math.PI;
                    scene.add(ceiling);
                }
            }
        })
        loader.load("src/img/light.png", function (texture) {
            var material = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide
            });
            for (var i = 0; i < 5; i++) {
                var ceiling = new THREE.Mesh(geoLight, material);
                ceiling.position.set(-8, 155, 1600 - 700 * i);
                ceiling.rotation.x = 0.5 * Math.PI;
                ceiling.rotation.z = 1 * Math.PI;
                scene.add(ceiling);
            }
        })
    }

    //地板
    function initfloor() {
        var geometry = new THREE.PlaneGeometry(175, 350);
        var loader = new THREE.TextureLoader();
        loader.load("src/img/hardwood2_diffuse.jpg", function (texture) {
            var material = new THREE.MeshPhongMaterial({
                map: texture,
                side: THREE.DoubleSide
            });
            //走廊模板
            for (var i = 0; i < 28; i++) {
                var floor = new THREE.Mesh(geometry, material);
                floor.position.set(175, -150, 2000 - 175 * i);
                floor.rotation.x = 0.5 * Math.PI;
                floor.rotation.z = 0.5 * Math.PI;
                floor.receiveShadow = true;
                scene.add(floor);
                var floor2 = new THREE.Mesh(geometry, material);
                floor2.position.set(-175, -150, 2000 - 175 * i);
                floor2.rotation.x = 0.5 * Math.PI;
                floor2.rotation.z = 0.5 * Math.PI;
                floor2.receiveShadow = true;
                scene.add(floor2);
            }
            //拐弯模板
            for (var j = 0; j < 2; j++) {
                for (k = 0; k < 4; k++) {
                    var floor = new THREE.Mesh(geometry, material);
                    floor.position.set(525 + 350 * j, -150, -2720 + k * 175);
                    floor.rotation.x = 0.5 * Math.PI;
                    floor.rotation.z = 0.5 * Math.PI;
                    floor.receiveShadow = true;
                    scene.add(floor);
                }
            }
        })
    }


    function initWall() {
        //白墙
        var geoRwall = new THREE.BoxGeometry(4200, 300, 3);
        var geoLWall = new THREE.BoxGeometry(4900, 300, 3);
        var geohengWall = new THREE.BoxGeometry(1400, 300, 3);
        var loader = new THREE.TextureLoader();
        loader.load("src/img/wall-1024.jpg", function (texture) {
            var material = new THREE.MeshPhongMaterial({
                // var material = new THREE.MeshLambertMaterial({
                map: texture,
                side: THREE.DoubleSide
            });
            var lWall = new THREE.Mesh(geoLWall, material);
            var rWall = new THREE.Mesh(geoRwall, material);
            var hwall = new THREE.Mesh(geohengWall, material);
            var hwall2 = new THREE.Mesh(geohengWall, material);
            lWall.position.set(-350, 0, -350);
            lWall.rotation.y = 0.5 * Math.PI;
            rWall.position.set(350, 0, 0);
            rWall.rotation.y = 0.5 * Math.PI;
            hwall.position.set(350, 0, -2800);
            hwall2.position.set(1050, 0, -2100);
            scene.add(lWall);
            scene.add(rWall);
            scene.add(hwall);
            scene.add(hwall2);
        })

        var geobrWall = new THREE.BoxGeometry(4200, 20, 3);
        var geoblWall = new THREE.BoxGeometry(4900, 20, 3);
        var geobhengWall = new THREE.BoxGeometry(1400, 20, 3);
        var material2 = new THREE.MeshBasicMaterial({
            color: 0x191818,
            side: THREE.DoubleSide
        });

        //底部黑墙
        var blWall = new THREE.Mesh(geoblWall, material2);
        var brWall = new THREE.Mesh(geobrWall, material2);
        var bhWall = new THREE.Mesh(geobhengWall, material2);
        var bhWall2 = new THREE.Mesh(geobhengWall, material2);
        blWall.position.set(-349, -140, -350);
        blWall.rotation.y = 0.5 * Math.PI;
        brWall.position.set(349, -140, 0);
        brWall.rotation.y = 0.5 * Math.PI;
        scene.add(blWall);
        scene.add(brWall);

        bhWall.position.set(350, -140, -2799);
        bhWall2.position.set(1050, -140, -2103);
        scene.add(bhWall);
        scene.add(bhWall2);

    }

    function initImgs() {
        var h = 180;
        var w = h * 0.75;
        var geometry = new THREE.BoxGeometry(w, h, 3);
        var plane = new THREE.PlaneGeometry(w, h); //矩形平面
        plane.name = "photo";
        var material = new THREE.MeshBasicMaterial({
            color: 0x333333,
            side: THREE.DoubleSide
        });

        var pz = 1560;
        var pz2 = 700;
        for (var i = 0; i < imgsArr.length; i++) {
            var picbox = new THREE.Mesh(geometry, material);
            picbox.position.set(-347, 0, pz - pz2 * i);
            picbox.rotation.y = 0.5 * Math.PI;
            scene.add(picbox);
            var texture = new THREE.TextureLoader().load(imgsArr[i]);
            var planeMaterial = new THREE.MeshBasicMaterial({
                map: texture
            });
            var pic = new THREE.Mesh(plane, planeMaterial);
            pic.position.set(-344, 0, pz - pz2 * i);
            pic.rotation.y = 0.5 * Math.PI;
            scene.add(pic);
        }

        for (var j = 0; j < imgsArr2.length; j++) {
            var picbox = new THREE.Mesh(geometry, material);
            picbox.position.set(347, 0, pz - pz2 * j);
            picbox.rotation.y = 0.5 * Math.PI;
            scene.add(picbox);

            var texture = new THREE.TextureLoader().load(imgsArr2[j]);
            var planeMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide
            });
            var pic = new THREE.Mesh(plane, planeMaterial);
            pic.position.set(344, 0, pz - pz2 * j);
            pic.rotation.y = 1.5 * Math.PI;
            scene.add(pic);
        }
    }

    function initMouse() {
        moveSpeed = 30;
        window.addEventListener('mousemove', onMouseMove, false);
        window.addEventListener('mousewheel', onMouseWheel, false);
        window.addEventListener('click', onMouseClick, false);
    }

    function onMouseWheel(event) {
        event.preventDefault();

        if (event.deltaY > 0) {
            //向前
            if (cameraz < 2030) {
                cameraz += moveSpeed;
            }
        } else if (event.deltaY < 0) {
            //向后
            if (cameraz > -1320) {
                cameraz -= moveSpeed;
            }

        }
        camera.position.z = cameraz;
        // camera.updateProjectionMatrix();
    }

    function onMouseMove(event) {
        event.preventDefault();
        //通过鼠标y移动的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        var mouseX = event.pageX;
        var lon = -96 + mouseX * 0.02;
        var phi = THREE.Math.degToRad(90);
        if (event.pageX > window.innerWidth / 2) {
            //向右
        } else if (event.pageX < window.innerWidth / 2) {
            //向左
        }
        var theta = THREE.Math.degToRad(lon);
        var targetPosition = new THREE.Vector3(0, 0, 0),
            position = camera.position;

        targetPosition.x = position.x + 100 * Math.sin(phi) * Math.cos(theta);
        targetPosition.y = position.y + 100 * Math.cos(phi);
        targetPosition.z = position.z + 100 * Math.sin(phi) * Math.sin(theta);
        camera.lookAt(targetPosition);
    }

    function onMouseClick(event) {

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects(scene.children);

        for (var i = 0; i < intersects.length; i++) {
            if (intersects[i].object.geometry.name == "photo") {
                var imgurl = intersects[i].object.material.map.image.src;
                var objPosition = intersects[i].object.position;
                // intersects[i].object.material.color.set(0xff0000);
                camera.position.set(0, 0, objPosition.z)
                camera.lookAt(objPosition);
                window.removeEventListener('mousemove', onMouseMove, false);
                window.removeEventListener('mousewheel', onMouseWheel, false);
                $("#imgsrc").attr("src", imgurl);
                $("#img-box").show();
            }

        }

    }



    function animate() {

        render();
        requestAnimationFrame(animate);

    }

    function render() {
        // lightHelper.update();
        // shadowCameraHelper.update();

        // 通过鼠标的位置和当前相机的矩阵计算出raycaster
        raycaster.setFromCamera(mouse, camera);
        // 获取raycaster直线和所有模型相交的数组集合
        var intersects = raycaster.intersectObjects(scene.children);
        var ifpointer = false; //是否手型鼠标
        for (var i = 0; i < intersects.length; i++) {
            if (intersects[i].object.geometry.name == "photo") {
                ifpointer = true;
            }

        }
        if (ifpointer) {
            $("#canvas-vr").css({
                "cursor": "pointer"
            })
        } else {
            $("#canvas-vr").css({
                "cursor": "default"
            })
        }
        renderer.render(scene, camera);
    }



})