#!/bin/bash

rtmp_sources=(
    "rtmp://103.130.211.150:10050/stream"
    "rtmp://103.130.211.150:10050/stream"
    # Add more RTMP sources as needed
)

# Directory to store HLS files
hls_dir="/var/www/html"

# Loop through each RTMP source
for rtmp_source in "${rtmp_sources[@]}"
do
    # Extract stream name from RTMP source URL
    stream_name=$(echo $rtmp_source | awk -F'/' '{print $NF}')

    # Create directory for HLS stream
    mkdir -p "$hls_dir/$stream_name"

    # Run FFmpeg to convert RTMP to HLS
    ffmpeg -i "$rtmp_source" \
    -c:v libx264 -c:a aac -strict -2 \
    -f hls -hls_time 10 -hls_list_size 10 -hls_segment_filename "$hls_dir/$stream_name/segment_%03d.ts" \
    "$hls_dir/$stream_name/index.m3u8" &
done

# Wait for all FFmpeg processes to finish
wait
