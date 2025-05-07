resource "aws_vpc" "way_out_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name        = "way_out_vpc"
    Environment = "prod"
  }
}

resource "aws_internet_gateway" "way_out_igw" {
  vpc_id = aws_vpc.way_out_vpc.id

  tags = {
    Name        = "way_out_igw"
    Environment = "prod"
  }
}

# Public subnets
resource "aws_subnet" "way_out_public_subnet" {
  vpc_id                  = aws_vpc.way_out_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "af-south-1a"
  tags = {
    Name        = "way_out_public_subnet"
    Environment = "prod"
  }
}
resource "aws_subnet" "way_out_public_subnet2" {
  vpc_id                  = aws_vpc.way_out_vpc.id
  cidr_block              = "10.0.2.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "af-south-1b"
  tags = {
    Name        = "way_out_public_subnet2"
    Environment = "prod"
  }
}

resource "aws_route_table" "way_out_public_route_table" {
  vpc_id = aws_vpc.way_out_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.way_out_igw.id
  }

  tags = {
    Name        = "way_out_public_route_table"
    Environment = "prod"
  }
}

resource "aws_route_table_association" "way_out_public_route_table_association" {
  subnet_id      = aws_subnet.way_out_public_subnet.id
  route_table_id = aws_route_table.way_out_public_route_table.id
}

resource "aws_route_table_association" "way_out_public_route_table_association2" {
  subnet_id      = aws_subnet.way_out_public_subnet2.id
  route_table_id = aws_route_table.way_out_public_route_table.id
}
