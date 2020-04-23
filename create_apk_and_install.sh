jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore dist/my-release-key.keystore dist/cordova/android/apk/release/app-release-unsigned.apk alias_name
./dist/zipalign -v 4 /dist/cordova/android/apk/release/app-release-unsigned.apk StackTest.apk

read -p "Do you want to install apk via adb? (y or n)" yn
case ${yn:-N} in
  [Yy]* ) adb install StackTest.apk;
esac
