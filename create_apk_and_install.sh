jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore dist/my-release-key.keystore dist/cordova/android/apk/release/app-release-unsigned.apk alias_name
rm dist/StackTest.apk
./dist/zipalign -v 4 dist/cordova/android/apk/release/app-release-unsigned.apk dist/StackTest.apk

read -p "Do you want to install apk via adb? (y or n)" yn
case ${yn:-N} in
  [Yy]* ) adb install dist/StackTest.apk;
esac
