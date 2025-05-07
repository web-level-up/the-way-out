terraform {
  backend "s3" {
    bucket = "way-out-terraform-state"
    key    = "terraform.tfstate"
    region = "af-south-1"
  }
}
