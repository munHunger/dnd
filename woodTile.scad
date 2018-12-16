woodTile();
module woodTile(width = 50, depth = 50, plankCount = 7, printConnectorHoles = false) {
    tileHeigth = 5;
    difference() {
        cube([width, depth, tileHeigth]);
        connectorCount = 2;

        if(printConnectorHoles) {
            union() {
                translate([width / 2, depth / 2])
                for(n = [0:1:4]) {
                    rotate([0,0,90*n])
                    translate([-width / 2, -depth / 2])
                    for(i = [1:1:connectorCount]) {
                        translate([(width / (connectorCount + 1)) * i, 0, tileHeigth / 2])
                        rotate([90,0,0])
                        connector();
                    }
                }
            }
        }
    }
    spacing = 0.5;
    plankWidth = width / (plankCount + 1) - spacing;
    plankHeight = 1;
    translate([0,0,tileHeigth])
    for(i = [0:1:plankCount/2]) {
        translate([0,(plankWidth + spacing) * i * 2,0]) {
            //Long bar
            cube([width,plankWidth,plankHeight]);
            //2 short bars
            translate([0, plankWidth + spacing])
            cube([(width - spacing) / 2,plankWidth,plankHeight]);
            translate([(width + spacing) / 2, plankWidth + spacing])
            cube([(width - spacing) / 2,plankWidth,plankHeight]);
        }
    }
}

module connector() {
    length = 10;
    width = 4;
    intersection() {
        hull() {
            translate([0,0,length / 2 - width / 2])
            sphere(r = width/2, $fn = 8);
            translate([0,0,-length / 2 + width / 2])
            sphere(r = width/2, $fn = 8);
        }
        union() {
            cube([width / 3, width, length], center = true);
            cube([width, width / 3, length], center = true);
        }
    }
}