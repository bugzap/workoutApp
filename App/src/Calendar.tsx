import React, { useState, useEffect } from "react";
import { View, Button, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CalendarApp =  () => {
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    const fetchRecentDates = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const workoutKeys = keys.filter(key => key.startsWith('workout_'));
        const workoutDates = workoutKeys.map(key => key.replace('workout_', ''));
        
        // Generate marked dates
        const markedDates = workoutDates.reduce((acc, date) => {
          acc[date] = { marked: true, dotColor: "red", selected: true, selectedColor: "red" };
          return acc;
        }, {});

        setMarkedDates(markedDates);
      } catch (error) {
        console.error("Failed to fetch recent dates:", error);
      }
    };

    fetchRecentDates();
  }, []);

  return (
    <View style={styles.container}>

      
        <View style={styles.calendarContainer}>
          <Calendar
            // Set the current month to two months ago
            current={new Date().toISOString().split("T")[0]}
            // Limit the range to show only the last two months
            pastScrollRange={2}
            futureScrollRange={0}
            // Highlight recent dates
            markedDates={markedDates}
            theme={{
              selectedDayBackgroundColor: "red",
              selectedDayTextColor: "white",
              todayTextColor: "blue",
              dayTextColor: "black",
              arrowColor: "red",
              monthTextColor: "black",
            }}
            onDayPress={(day) => {
              console.log("Selected date: ", day.dateString);
            }}
          />
        </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  calendarContainer: {
    marginTop: 20,
    width: "100%",
  },
});

export default CalendarApp;