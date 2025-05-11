resource "aws_s3_bucket" "way_out_frontend" {
  bucket        = "way-out-frontend"
  force_destroy = true
  tags = {
    Name        = "way_out_frontend"
    Environment = "prod"
  }
}

resource "aws_s3_bucket_ownership_controls" "way_out_frontend_ownership_controls" {
  bucket = aws_s3_bucket.way_out_frontend.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "way_out_frontend_public_access_block" {
  bucket                  = aws_s3_bucket.way_out_frontend.id
  block_public_acls       = false
  ignore_public_acls      = false
  restrict_public_buckets = false
  block_public_policy     = false
}

resource "aws_s3_bucket_policy" "way_out_frontend_policy" {
  bucket = aws_s3_bucket.way_out_frontend.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.way_out_frontend.arn}/*"
      }
    ]
  })
}

resource "aws_s3_bucket_website_configuration" "way_out_frontend_website" {
  bucket = aws_s3_bucket.way_out_frontend.id
  index_document {
    suffix = "index.html"
  }
  error_document {
    key = "error.html"
  }
}
