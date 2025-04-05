# workoutApp


Keep track of your workouts 
* Update your progress during the workout
* Save progress
* Get monthly stats

How to install

1. npx expo run:android so that android folders get created

2. Track android/ on git so that expo go can see it during build.

3. Quirks with expo go: While building the apk, you may run into:

The version of the Compose Compiler requires Kotlin version 1.4.21 but you appear to be using Kotlin version 1.4.21-2 which is not known to be compatible. Please fix your configuration (or suppressKotlinVersionCompatibilityCheck but don't say I didn't warn you!).
Solution:

In android/build.grade, add this 

https://stackoverflow.com/a/68626719

4. Build using npx eas build --platform android --profile debug

5. Now, put android/ back into .gitignore