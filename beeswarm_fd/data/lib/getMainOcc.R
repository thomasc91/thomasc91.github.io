#
# Main Occupation Group Based on OCC2010
#
getMainOcc <- function(x) {
  
  if (x >= 10 && x <= 430) {
    grp <- 1
  } else if (x >= 500  && x <=  730) {
    grp <- 2
  } else if (x >= 800  && x <=  950) {
    grp <- 3
  } else if (x >= 1000  && x <=  1240) {
    grp <- 4
  } else if (x >= 1300  && x <=  1540) {
    grp <- 5
  } else if (x >= 1550  && x <=  1560) {
    grp <- 6
  } else if (x >= 1600  && x <=  1980) {
    grp <- 7
  } else if (x >= 2000  && x <=  2060) {
    grp <- 8
  } else if (x >= 2100  && x <=  2150) {
    grp <- 9
  } else if (x >= 2200  && x <=  2550) {
    grp <- 10
  } else if (x >= 2600  && x <=  2920) {
    grp <- 11
  } else if (x >= 3000  && x <=  3540) {
    grp <- 12
  } else if (x >= 3600  && x <=  3650) {
    grp <- 13
  } else if (x >= 3700  && x <=  3950) {
    grp <- 14
  } else if (x >= 4000  && x <=  4150) {
    grp <- 15
  } else if (x >= 4200  && x <=  4250) {
    grp <- 16
  } else if (x >= 4300  && x <=  4650) {
    grp <- 17
  } else if (x >= 4700  && x <=  4965) {
    grp <- 18
  } else if (x >= 5000  && x <=  5940) {
    grp <- 19
  } else if (x >= 6005  && x <=  6130) {
    grp <- 20
  } else if (x >= 6200  && x <=  6795) {
    grp <- 21
  } else if (x >= 6800  && x <=  6940) {
    grp <- 22
  } else if (x >= 7000  && x <=  7630) {
    grp <- 23
  } else if (x >= 7700  && x <=  8965) {
    grp <- 24
  } else if (x >= 9000  && x <=  9750) {
    grp <- 25
  } else if (x >= 9800  && x <=  9830) {
    grp <- 26
  } else if (x == 9920) {
    grp <- 27
  } else {
    grp <- NA
  }
  
  return(grp)
}
