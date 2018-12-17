//Generate a plank. nails determine what side of the plank to put nails, if at all
module plank(dimensions = [50, 5, 1], nails = [false, false], crackWidth = 0.5, segments = 8, cracks = 4) {
    randomStrength = 1;
    segmentWidth = dimensions[0]/segments;

    difference() {
        //Base mesh
        cube(dimensions);
        //Generate cracks
        for(n = [0:1:cracks]) {
            pointList = rands(0, randomStrength, segments + 1);
            translate([0,(dimensions[1]/(cracks + 1)) * n,dimensions[2]])
            for(i = [0:1:segments-1]) {
                line([segmentWidth*i,pointList[i],0], [segmentWidth*(i+1),pointList[i + 1],0], crackWidth / 2);
            }
        }
    }

    module nails() {
        translate([rands(-0.2, 0.2, 1)[0],1+rands(-0.2, 0.2, 1)[0],0])
        cylinder(r=0.5, h=0.5, center=true, $fn = 10);
        translate([rands(-0.2, 0.2, 1)[0],dimensions[1]-1+rands(-0.2, 0.2, 1)[0],0])
        cylinder(r=0.5, h=0.5, center=true, $fn = 10);
    }

    translate([0,0,dimensions[2]]) {
        if(nails[0]) {
            translate([1,0,0])
            nails();
        }
        if(nails[1]) {
            translate([dimensions[0]-1,0,0])
            nails();
        }
    }
}
//Internal use
module line(a, b, r) { 

    dir = b-a; 
    h   = norm(dir); 
    if(dir[0] == 0 && dir[1] == 0) { 
        // no transformation necessary 
        cylinder(r=r, h=h); 
    } 
    else { 
        w  = dir / h; 
        u0 = cross(w, [0,0,1]); 
        u  = u0 / norm(u0); 
        v0 = cross(w, u); 
        v  = v0 / norm(v0); 
        multmatrix(m=[[u[0], v[0], w[0], a[0]], 
                      [u[1], v[1], w[1], a[1]], 
                      [u[2], v[2], w[2], a[2]], 
                      [0,    0,    0,    1]]) 
        cylinder(r=r, h=h, $fn = 4); 
    } 
} 