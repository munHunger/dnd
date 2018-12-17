include <plank.scad>;

module woodTile(width = 50, depth = 50, plankCount = 7, printConnectorHoles = true) {
    tileHeigth = 4;
    difference() {
        cube([width, depth, tileHeigth]);
        connectorCount = 1;

        if(printConnectorHoles) {
            union() {
                translate([width / 2, depth / 2])
                for(n = [0:1:4]) {
                    rotate([0,0,90*n])
                    translate([-width / 2, -depth / 2])
                    for(i = [1:1:connectorCount]) {
                        translate([(width / (connectorCount + 1)) * i, 0, -0.001])
                        rotate([0,0,90])
                        connector(inset = true);
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
            plank([width,plankWidth,plankHeight], nails = [true, true]);
            //2 short bars
            translate([0, plankWidth + spacing])
            plank([(width - spacing) / 2,plankWidth,plankHeight], nails = [false, true]);
            translate([(width + spacing) / 2, plankWidth + spacing])
            plank([(width - spacing) / 2,plankWidth,plankHeight], nails = [true, false]);
        }
    }
}

module connector(inset = false) {
    length = 10;
    width = 4;
    tolerance = 0.2;
    //Base plate
    hull() {
        for(i = [0:1:1]) {
            mirror([i,0,0])
            translate([length/2-width/2,0,0])
            cylinder(r=width/2 + (inset ? tolerance/2 : 0), h=1 + (inset ? tolerance : 0), $fn = 10);
        }
    }
    //Pegs
    for(i = [0:1:1]) {
        mirror([i,0,0])
        translate([length/2-width/2,0,0])
        cylinder(r=width/3 + (inset ? tolerance/2 : 0), h=3 + (inset ? tolerance : 0), $fn = 12);
    }
}