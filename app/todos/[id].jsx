import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Octicons from '@expo/vector-icons/Octicons';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useFonts, Inter_500Medium } from '@expo-google-fonts/inter';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '@/context/ThemeContext';



export default function EditScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [todo, setTodo] = useState({});
    const [loaded, error] = useFonts({
        Inter_500Medium
    });
    const { theme, colorScheme, setColorScheme } = useContext(ThemeContext);
    const styles = createStyles(theme, colorScheme);

    useEffect(() => {
        const getTodoAsync = async () => {
            try {
                const todos = await AsyncStorage.getItem('Todos');
                const parsedTodos = todos ? JSON.parse(todos) : null;

                if (parsedTodos && todos.length) {
                    const foundTodo = parsedTodos.find(todo => todo.id === +id);
                    setTodo(foundTodo);
                }
            } catch (e) {
                console.log('Error getting todo by id', e);
            }
        }

        getTodoAsync();

    }, [id])


    const handleSaveTodo = async () => {
        try {
            const todos = await AsyncStorage.getItem('Todos');
            const parsedTodos = todos ? JSON.parse(todos) : null;
            if (parsedTodos && parsedTodos.length) {
                const filteredTodos = parsedTodos.filter(todo => todo.id !== +id);
                const updatedTodosList = [...filteredTodos, todo];
                const stringfiedTodos = JSON.stringify(updatedTodosList)
                await AsyncStorage.setItem('Todos', stringfiedTodos)
                router.push('/')
            } else {
                await AsyncStorage.setItem('Todos', JSON.stringify([todo]));
                router.push('/')
            }

        } catch (e) {
            console.log('Error saving todo', e);
        }
    }

    if (!loaded && !error) {
        return null;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    name='todo'
                    value={todo?.title}
                    placeholder='Edit Todo'
                    placeholderTextColor='gray'
                    onChangeText={(text) => setTodo(prev => ({ ...prev, title: text }))}
                />
                <Pressable style={{ paddingHorizontal: 5 }} onPress={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}>
                    <Octicons name={colorScheme === "dark" ? "moon" : "sun"} size={26} color={theme.text} width={36} selectable={undefined} />
                </Pressable>
            </View>
            <View style={styles.buttonContainer}>
                <Pressable
                    style={styles.addButton}
                    onPress={handleSaveTodo}
                >
                    <Text style={styles.buttonText}>Save</Text>
                </Pressable>
                <Pressable
                    style={[styles.addButton, { backgroundColor: 'red' }]}
                    onPress={() => router.push('/')}
                >
                    <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
            </View>
        </SafeAreaView >
    )
}

const createStyles = (theme, colorScheme) => StyleSheet.create(({
    container: {
        flex: 1,
        backgroundColor: theme.background
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 'auto',
        padding: 10,
        marginBottom: 8,
        pointerEvents: 'auto',
        width: "100%",
        maxWidth: 1024,
        gap: 20
    },
    input: {
        flex: 1,
        color: theme.text,
        borderColor: 'gray',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        fontSize: 18,
        fontFamily: Inter_500Medium,
        minWidth: 0
    },
    addButton: {
        backgroundColor: colorScheme === 'dark' ? 'white' : 'black',
        borderRadius: 5,
        padding: 10,
    },
    buttonText: {
        color: colorScheme === 'light' ? 'white' : 'black',
        fontWeight: '500',
        fontSize: 18,
        fontFamily: Inter_500Medium,
    },
    todoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 5,
        borderBottomWidth: 1,
        borderBottomColor: theme.text,
        maxWidth: 1024,
        padding: 10,
    },

    buttonContainer: {
        flexDirection: 'row',
        marginHorizontal: 10,
        paddingHorizontal: 'auto',
        gap: 10,
    }

}))