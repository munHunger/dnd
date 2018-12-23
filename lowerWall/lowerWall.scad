include <../plank/plank.scad>;
include <../connector/connector.scad>;

lowerWall();
module lowerWall(width = 50, height = 15, printConnectorHoles = true) {
    wallDepth = 6;
    plankDepth = 2;
    detailPlankThickness = 6;
    supportPlankThickness = 10;
    difference() {
        union() {
            translate([0,plankDepth,0])
            cube([width, wallDepth-2*plankDepth, height]);
            
            translate([0,wallDepth/2,0])
            for(i = [0:1:1]) {
                mirror([0,i,0]) {
                    translate([0,-wallDepth/2,0]) {
                        translate([0,plankDepth,0])
                        rotate([90,0,0])
                        plank([width,supportPlankThickness, plankDepth], nails = [true, true]);

                        translate([0,plankDepth,height])
                        rotate([0,90,0])
                        rotate([90,0,0])
                        plank([height-supportPlankThickness,detailPlankThickness, plankDepth/2], segments = 2);
                        translate([width-detailPlankThickness,plankDepth,height])
                        rotate([0,90,0])
                        rotate([90,0,0])
                        plank([height-supportPlankThickness,detailPlankThickness, plankDepth/2], segments = 2);
                    }
                }
            }
        }
        if(printConnectorHoles) {
            union() {
                translate([width/2, 0, -0.01]) {
                    rotate([0,0,90])
                    connector(inset = true);
                    translate([0,6,0])
                    rotate([0,0,90])
                    connector(inset = true);
                }
                translate([0,wallDepth/2,-0.01])
                connector(inset = true);
                translate([width,wallDepth/2,-0.01])
                connector(inset = true);

                translate([detailPlankThickness/2,wallDepth/2,height])
                wallConnector(inset = true);
                translate([width-detailPlankThickness/2,wallDepth/2,height])
                wallConnector(inset = true);
            }
        }
    }
}