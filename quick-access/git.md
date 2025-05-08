git init
git remote remove origin 2>$null
git remote add origin https://github.com/pelchers/dev-profiles-built.git
git checkout -b main



git add .
git commit -m "Initial commit"
git push -u origin main