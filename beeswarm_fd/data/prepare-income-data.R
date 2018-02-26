library(dplyr)
options(scipen=999)

source("lib/getMainOcc.R")

# Load data.
load("workers.RData")
years <- unique(workers$YEAR)


# Encode occupation into main groups
workers$main_occ <- sapply(workers$OCC2010, getMainOcc)
occs <- unique(workers$main_occ)

# Adjusting for inflation
cpi <- read.csv("cpi-1960-2014.txt", stringsAsFactors=FALSE, sep=",")
ref_cpi <- cpi[cpi$Year == 2014, "Annual"]

inctot_adj <- c()
for (y in years) {
  grp <- workers[workers$YEAR == y,]
  
  curr_cpi <- cpi[cpi$Year == y, "Annual"]
  cpi_factor <- ref_cpi / curr_cpi
  inctot_adj <- c(inctot_adj, grp$INCTOT*cpi_factor)
}
workers$inctot_adj <- inctot_adj



#
# Bin total income in $5,000 buckets, from $0 to $200,000. For each year and main occupation.
#

income_cnts <- matrix(nrow=length(years)*length(occs), ncol=2+42)
row_num <- 1
for (y in years) {
  for (o in occs) {
    grp <- workers[workers$YEAR == y & workers$main_occ == o & workers$inctot_adj > 0,]
    grp$inc_rnd <- ceiling(grp$inctot_adj / 5000)
    grp_cnts <- tally(group_by(grp, inc_rnd), sort=FALSE, wt=PERWT)
    
    # Going to group the last bin.
    grp_cnts0 <- grp_cnts[grp_cnts$inc_rnd < 42,]
    grp_cnts1 <- grp_cnts[grp_cnts$inc_rnd >= 42,]
    
    grp_cnts_full <- rep(0, 42)
    grp_cnts_full[grp_cnts0$inc_rnd] <- grp_cnts0$n
    grp_cnts_full[42] <- sum(grp_cnts1$n)
    
    curr_row <- c(y, o, grp_cnts_full)
    income_cnts[row_num,] <- curr_row
    
    row_num <- row_num + 1
  }
}

income_by_occ <- as.data.frame(income_cnts)
colnames(income_by_occ) <- c("year", "occ", paste("inc", 1:42, sep=""))

# Save data for interactive.
write.table(income_by_occ, "income-by-occ.tsv", sep="\t", row.names=FALSE)








