include <../plank/plank.scad>;
crate();
module crate(width = 25, height = 25, depth = 25, spars = 4, buildSides = true, buildLids = true) {
    spacing = 0.2;
    sparHeight = 1;
    sparWidth = width / (spars + 1);
    sparWidthWithSpacing = sparWidth - spacing;

    if(buildLids) {

        color([0.3,0.3,0.3])
        translate([sparHeight*2,sparHeight*2,sparHeight])
        difference() {
            translate([0.5,0.5,0]) {
                cube([width-sparHeight*4 - 1, depth-sparHeight*4 - 1, height-sparHeight*2]);
            }
            translate([0,0,0.5])
            cube([width-sparHeight*4, depth-sparHeight*4, height-sparHeight*2 - 1]);
        }
        // Build top & bottom
        for(n = [0:1:1]) {
            translate([0,0,n * (height - sparHeight)])
            for(i = [0:1:spars]) {
                translate([i * sparWidth + sparWidthWithSpacing,0,n == 1 ? 0 : sparHeight])
                rotate([0,0,90])
                mirror([0,0,n == 1 ? 0 : 1])
                plank([depth, sparWidthWithSpacing, sparHeight], nails = [n  == 1, n == 1]);
            }
        }
    }

    if(buildSides) {
        color([0.3,0.3,0.3])
        translate([sparHeight*2,sparHeight*2,sparHeight])
        difference() {
            cube([width-sparHeight*4, depth-sparHeight*4, height-sparHeight*2]);
            translate([0.5,0.5,-0.5])
            cube([width-sparHeight*4 - 1, depth-sparHeight*4 - 1, height-sparHeight*2 + 1]);
        }
        //Build sides
        sideSparWidth = (height-2*sparHeight) / (spars + 1);
        translate([width / 2, depth / 2, sparHeight])
        for(n = [0:1:4]) {
            rotate([0,0,n*90])
            translate([-width / 2, -depth / 2, 0])
            translate([sparHeight,sparHeight,0])
            for(i = [0:1:spars]) {
                translate([0,0,i * sideSparWidth])
                translate([sparHeight,0,sparWidth - spacing])
                rotate([0,-90,0])
                rotate([0,0,90])
                plank([depth - sparHeight * 2, sideSparWidth - spacing, sparHeight]);
            }
        }

        //Build corners
        translate([width / 2, depth / 2, 0])
        for(n = [0:1:4]) {
            rotate([0,0,n*90])
            translate([-width / 2, -depth / 2, 0])
            translate([0.25,sparHeight + 0.25,height - sparHeight * 2 + sparHeight])
            rotate([0,0,-90])
            rotate([0,90,0])
            union() {
                plank([height - sparHeight * 2, sparWidth, sparHeight]);
                translate([0,sparHeight,-sparWidth+sparHeight])
                rotate([90,0,0])
                plank([height - sparHeight * 2, sparWidth, sparHeight]);
            }
        }
    }
}