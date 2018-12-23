crate();
module crate(width = 25, height = 25, depth = 25, spars = 4) {
    spacing = 0.2;
    sparHeight = 1;
    sparWidth = width / (spars + 1);
    sparWidthWithSpacing = sparWidth - spacing;
    color([0.3,0.3,0.3])
    translate([sparHeight*2,sparHeight*2,sparHeight])
    cube([width-sparHeight*4, depth-sparHeight*4, height-sparHeight*2]);

    //Build top & bottom
    for(n = [0:1:1]) {
        translate([0,0,n * (height - sparHeight)])
        for(i = [0:1:spars]) {
            translate([i * sparWidth,0,0])
            cube([sparWidthWithSpacing, depth, sparHeight]);
        }
    }

    //Build sides
    translate([width / 2, depth / 2, 0])
    for(n = [0:1:4]) {
        rotate([0,0,n*90])
        translate([-width / 2, -depth / 2, 0])
        translate([sparHeight,sparHeight,0])
        for(i = [0:1:spars]) {
            translate([0,0,i * sparWidth])
            cube([sparHeight, depth - sparHeight * 2, sparWidthWithSpacing]);
        }
    }

    //Build corners
    translate([width / 2, depth / 2, 0])
    for(n = [0:1:4]) {
        rotate([0,0,n*90])
        translate([-width / 2, -depth / 2, 0])
        translate([spacing, spacing, sparHeight])
        cube([sparWidth, sparWidth, height - sparHeight * 2]);
    }
}