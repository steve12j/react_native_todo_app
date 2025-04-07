import { useState, useContext, useEffect } from "react";
import { todosJson } from '@/data/todos'
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, StyleSheet, Pressable, TextInput, FlatList, StatusBar } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFonts, Inter_500Medium } from '@expo-google-fonts/inter';
import Octicons from '@expo/vector-icons/Octicons';
import { ThemeContext } from "@/context/ThemeContext";
import Animated, { LinearTransition } from "react-native-reanimated";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [loaded, error] = useFonts({
    Inter_500Medium
  });
  const { theme, colorScheme, setColorScheme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todosData = await AsyncStorage.getItem('Todos');
        const parsedTodos = todosData !== null ? JSON.parse(todosData) : null;

        if (parsedTodos && parsedTodos.length) {
          setTodos(parsedTodos.sort((a, b) => b.id - a.id));
        } else {
          setTodos(todosJson.sort((a, b) => b.id - a.id));
        }
      } catch (e) {
        console.log('Error fetching todos', e);
      }
    }

    fetchTodos();
  }, [todosJson]);

  useEffect(() => {
    const setTodosAsync = async () => {
      try {
        const stringfyTodos = JSON.stringify(todos);
        await AsyncStorage.setItem('Todos', stringfyTodos);
      } catch (e) {
        console.log('Error setting todos', e)
      }
    }
    setTodosAsync();
  }, [todos]);

  if (!loaded && !error) {
    return null;
  }

  const styles = createStyles(theme, colorScheme);

  const addTodo = () => {
    if (text.trim()) {
      const newTodoId = todos.length ? todos[0].id + 1 : 1;
      const newTodo = {
        id: newTodoId,
        title: text,
        completed: false,
      };
      setTodos((prev) => ([...prev, newTodo].sort((a, b) => b.id - a.id)));
      setText('');
    }
  }

  const toggleTodo = id => {
    setTodos((prevTodos) => prevTodos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };
  const removeTodo = id => { setTodos(todos.filter(todo => todo.id !== id)) };

  const renderItem = ({ item }) => (<View View style={styles.todoItem} >
    <Pressable
      style={{ flex: 1 }}
      onPress={() => router.navigate(`todos/${item.id}`)}
      onLongPress={() => toggleTodo(item.id)}
    >
      <Text
        style={[styles.todoText, item.completed && styles.completedText]}
      >
        {item?.title}
      </Text>
    </Pressable>
    <Pressable style={styles.removeButton} onPress={() => removeTodo(item.id)} >
      <MaterialCommunityIcons name="delete-circle" size={24} color="red" selectable={undefined} />
    </Pressable>
  </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          placeholder="Add a new todo"
          placeholderTextColor='gray'
          onChangeText={setText}
        />
        <Pressable onPress={addTodo} style={styles.addButton} >
          <Text style={styles.buttonText}>Add</Text>
        </Pressable>
        <Pressable style={{ paddingHorizontal: 5 }} onPress={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}>
          <Octicons name={colorScheme === "dark" ? "moon" : "sun"} size={26} color={theme.text} width={36} selectable={undefined} />
        </Pressable>
      </View>
      <Animated.FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(todo) => todo.id}
        contentContainerStyle={{ flexGrow: 1 }}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode='on-drag'
      />
      <StatusBar style={colorScheme === 'dark' ? "light" : 'dark'} />
    </SafeAreaView>
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
    marginBottom: 15,
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
  todoText: {
    flex: 1,
    fontSize: 18,
    flexWrap: 'wrap',
    color: theme.text,
    fontFamily: Inter_500Medium,
  },
  completedText: {
    color: 'gray',
    textDecorationLine: "line-through"
  },
  removeButton: {
    padding: '10',
    alignItems: 'center'
  }
}))
