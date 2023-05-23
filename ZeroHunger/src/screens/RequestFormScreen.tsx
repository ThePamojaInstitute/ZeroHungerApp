import React, { useState } from "react";
import { Platform, ScrollView, FlatList, ImageBackground, TouchableHighlight } from "react-native";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import ImagePicker from "../components/ImagePicker";
import DatePicker from "../components/DatePicker"

export const RequestFormScreen = ({ navigation }) => {

    return (
        <ScrollView>
            <ImagePicker />
            <DatePicker />
        </ScrollView>
    )
}

const styles = StyleSheet.create({

})