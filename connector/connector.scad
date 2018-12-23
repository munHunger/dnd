module trippleConnector(inset = false) {
    length = 16;
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
    for(i = [0:1:2]) {
        translate([6 * i - 6,0,0])
        cylinder(r=width/3 + (inset ? tolerance/2 : 0), h=3 + (inset ? tolerance : 0), $fn = 12);
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

module wallConnector(inset = false) {
    if(inset)
        cube([3.2,3.2,8.4], center = true);
    if(!inset)
        cube([3,3,8], center = true);
}