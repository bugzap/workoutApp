import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Checkbox } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { workoutData } from "./data/workoutData";

// Helper function to calculate the current week based on today's date
const calculateCurrentWeek = (): number => {
  // Define the reference start date (e.g., the first workout day)
  const referenceDate = new Date("2024-12-19"); // Example start date (MM/DD/YYYY)
  
  // Get today's date
  const today = new Date();

  // Calculate the difference in days
  const diffTime = today.getTime() - referenceDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 3600 * 24)); // Convert milliseconds to days

  // Calculate the current week (1-based index)
  const currentWeek = Math.floor(diffDays / 7) + 1;

  return currentWeek;
};

const App = () => {
  const [currentWeek, setCurrentWeek] = useState<number>(1); // Default to week 1
  const [completedExercises, setCompletedExercises] = useState<any>({}); // Track checked exercises

  // Function to load saved progress from AsyncStorage
  const loadProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem("workoutProgress");
      if (savedProgress) {
        setCompletedExercises(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error("Failed to load progress:", error);
    }
  };

  // Function to save progress to AsyncStorage
  const saveProgress = async () => {
    try {
      await AsyncStorage.setItem(
        "workoutProgress",
        JSON.stringify(completedExercises)
      );
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };

  // Update progress when a checkbox is clicked
  const handleCheckboxChange = (
    week: string,
    groupIndex: number,
    exerciseIndex: number,
    setIndex: number,
    checked: boolean
  ) => {
    const updatedProgress = { ...completedExercises };
    if (!updatedProgress[week]) {
      updatedProgress[week] = {};
    }
    if (!updatedProgress[week][groupIndex]) {
      updatedProgress[week][groupIndex] = [];
    }

    // Update the state for the specific set
    updatedProgress[week][groupIndex][exerciseIndex] = updatedProgress[week][groupIndex][exerciseIndex] || {};
    updatedProgress[week][groupIndex][exerciseIndex][setIndex] = checked;

    setCompletedExercises(updatedProgress);
    saveProgress(); // Save progress immediately
  };

  // Get the workout for the current week
  const getWorkoutForWeek = () => {
    const weekKey = `week${currentWeek}`;
    return workoutData[weekKey];
  };

  useEffect(() => {
    const week = calculateCurrentWeek(); // Dynamically calculate the current week
    setCurrentWeek(week); // Set the current week state
    loadProgress(); // Load saved progress when the app starts
  }, []);

  const renderWorkout = () => {
    const weekWorkout = getWorkoutForWeek();
    let groupIndex = 0;
    let exerciseGroups: any[] = [];

    // Group exercises based on water breaks
    let currentGroup: any[] = [];
    weekWorkout.forEach((exercise, index) => {
      if (exercise.name === "Water Break") {
        // When encountering a water break, push the current group to the groups array and start a new group
        if (currentGroup.length > 0) {
          exerciseGroups.push(currentGroup);
        }
        currentGroup = []; // Reset current group
      } else {
        currentGroup.push({ ...exercise, groupIndex }); // Add exercise to the current group
      }
    });
    if (currentGroup.length > 0) {
      exerciseGroups.push(currentGroup); // Push remaining exercises
    }

    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Week {currentWeek} Workout</Text>
        {exerciseGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.group}>
            <Text style={styles.groupTitle}>Group {groupIndex + 1}</Text>
            {group.map((exercise, exerciseIndex) => (
              <View key={exerciseIndex} style={styles.container}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <View style={styles.checkboxRow}>
                  {[...Array(exercise.sets)].map((_, setIndex) => (
                    <View key={setIndex} style={styles.checkboxContainer}>
                      <Checkbox
                        status={
                          completedExercises[`week${currentWeek}`]?.[groupIndex]?.[exerciseIndex]?.[setIndex]
                            ? "checked"
                            : "unchecked"
                        }
                        onPress={() =>
                          handleCheckboxChange(
                            `week${currentWeek}`,
                            groupIndex,
                            exerciseIndex,
                            setIndex,
                            !completedExercises[`week${currentWeek}`]?.[groupIndex]?.[exerciseIndex]?.[setIndex]
                          )
                        }
                      />
                      <Text style={styles.checkboxText}>Set {setIndex + 1}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.appContainer}>
      {renderWorkout()}
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  group: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  exerciseName: {
    fontSize: 16,
    marginBottom: 5,
  },
  checkboxRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxText: {
    fontSize: 16,
    marginLeft: 5,
  },
});

export default App;