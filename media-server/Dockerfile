FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY ./hls:/usr/share/nginx/html/hls
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

FROM jrottenberg/ffmpeg:4.4-scratch


# CMD ["-i","rtmp://103.130.211.150:10050/stream","-c:v","libx264", "-c:a","aac","-strict","-2","-f","hls","-hls_time","10","-hls_list_size","10","-hls_flags","delete_segments","-hls_segment_filename","/mnt/hls/segment_%01d.ts","/mnt/hls/index.m3u8"]

