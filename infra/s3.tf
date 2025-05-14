resource "aws_s3_bucket" "way_out_frontend" {
  bucket        = "way-out-frontend"
  force_destroy = true
  tags = {
    Name        = "way_out_frontend"
    Environment = "prod"
  }
}

resource "aws_s3_bucket" "maze_blob" {
  bucket        = "maze-blob"
  force_destroy = true
  tags = {
    Name        = "maze_blob"
    Environment = "prod"
  } 
}

resource "aws_s3_bucket_ownership_controls" "way_out_frontend_ownership_controls" {
  bucket = aws_s3_bucket.way_out_frontend.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_ownership_controls" "maze_blob_ownership_controls" {
  bucket = aws_s3_bucket.maze_blob.id
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

resource "aws_s3_bucket_public_access_block" "maze_blob_public_access_block" {
  bucket                  = aws_s3_bucket.maze_blob.id
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

resource "aws_s3_bucket_policy" "maze_blob_policy" {
  bucket = aws_s3_bucket.maze_blob.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.maze_blob.arn}/*"
      }
    ]
  })
  depends_on = [aws_s3_bucket_public_access_block.maze_blob_public_access_block]
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

resource "aws_s3_bucket_cors_configuration" "maze_blob_cors" {
  bucket = aws_s3_bucket.maze_blob.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}
