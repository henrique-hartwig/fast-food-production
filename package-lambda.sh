mkdir -p dist

for file in .build/application/handlers/**/*.js; 
    do name=$(basename $file .js);
    folder=$(basename $(dirname $file)); 
    mkdir -p dist/$folder; 
    zip -r dist/$folder/$name.zip $file .build/src; 
done
