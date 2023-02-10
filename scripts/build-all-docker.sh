total=5
count=1

build(){
	echo Building $count/$total
	docker build -t $1 --quiet $2
	((count=count+1))
}


echo 'Building all images as main. This makes testing the local docker compose easier'

build "ghcr.io/world-wide-weights/frontend:main" "../frontend"
build "ghcr.io/world-wide-weights/auth-backend:main" "../backend/auth"
build "ghcr.io/world-wide-weights/command-backend:main" "../backend/command"
build "ghcr.io/world-wide-weights/image-backend:main" "../backend/image"
build "ghcr.io/world-wide-weights/query-backend:main" "../backend/query"

echo All done
