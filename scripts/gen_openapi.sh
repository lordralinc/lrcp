cd web || exit

rm -r src/api

npm run generate-api

to_delete='git_push.sh .openapi-generator .gitignore .npmignore .openapi-generator-ignore'

for to_delete_file in $to_delete ; do
    rm -r src/api/$to_delete_file
done

rm openapitools.json

git add --ignore-errors -A -- src/api
