import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Modal,
} from 'react-native'

// --- Type Definitions ---
// Define a type for our expense objects
/**
 * @typedef {object} Expense
 * @property {string} id - A unique identifier for the expense.
 * @property {string} title - The title or description of the expense.
 * @property {number} amount - The amount of the expense.
 * @property {string} date - The date the expense was made.
 */

// --- Component: Main Application ---
// This component now shows a login screen by default, following the requested design.
const App = () => {
  // Use state to manage our list of expenses (kept for future use)
  const [expenses, setExpenses] = useState([
    { id: 'e1', title: 'Groceries', amount: 89.99, date: '2025-07-28' },
    {
      id: 'e2',
      title: 'Dinner with friends',
      amount: 50.0,
      date: '2025-07-27',
    },
    { id: 'e3', title: 'Coffee', amount: 4.5, date: '2025-07-26' },
  ])

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // --- Functions for managing expenses ---

  /**
   * Adds a new expense to the list.
   * @param {string} title
   * @param {number} amount
   */
  const addExpenseHandler = (title, amount) => {
    // In a real app, you would generate a unique ID and get the current date
    const newExpense = {
      id: Math.random().toString(),
      title,
      amount: parseFloat(amount),
      date: new Date().toISOString().split('T')[0],
    }
    setExpenses((currentExpenses) => [...currentExpenses, newExpense])
  }

  /**
   * Deletes an expense from the list based on its ID.
   * @param {string} id - The ID of the expense to delete.
   */
  const deleteExpenseHandler = (id) => {
    setExpenses((currentExpenses) =>
      currentExpenses.filter((expense) => expense.id !== id)
    )
  }

  const handleLogin = (email, password) => {
    // Implement your login logic here
    console.log(`Logging in with email: ${email} and password: ${password}`)
    // For now, we'll just set isLoggedIn to true
    setIsLoggedIn(true)
  }

  const handleRegister = (email, password) => {
    // Implement your registration logic here
    console.log(`Registering with email: ${email} and password: ${password}`)
    // For now, we'll just set isLoggedIn to true to proceed
    setIsLoggedIn(true)
  }

  if (!isLoggedIn) {
    return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} />
  }

  // If logged in, show the main expense tracker screen
  return (
    <View style={styles.appContainer}>
      <Text style={styles.title}>Expense Tracker</Text>
      <HomeScreen expenses={expenses} onDelete={deleteExpenseHandler} />
    </View>
  )
}

// --- Component: Auth Screen (Login/Registration) ---
const AuthScreen = ({ onLogin, onRegister }) => {
  // State to manage which form is currently being displayed
  const [isLoginView, setIsLoginView] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLoginPress = () => {
    onLogin(email, password)
  }

  const handleRegisterPress = () => {
    onRegister(email, password)
  }

  const toggleView = () => {
    // Clear inputs when toggling views
    setEmail('')
    setPassword('')
    setIsLoginView((prev) => !prev)
  }

  return (
    <View style={styles.loginPageContainer}>
      <View style={styles.loginCard}>
        {/* Toggle tabs */}
        <View style={styles.tabContainer}>
          <Pressable
            onPress={() => setIsLoginView(true)}
            style={[styles.tab, isLoginView && styles.activeTab]}
          >
            <Text style={[styles.tabText, isLoginView && styles.activeTabText]}>
              Log In
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setIsLoginView(false)}
            style={[styles.tab, !isLoginView && styles.activeTab]}
          >
            <Text
              style={[styles.tabText, !isLoginView && styles.activeTabText]}
            >
              Register
            </Text>
          </Pressable>
        </View>

        {isLoginView ? (
          // Login Form
          <>
            <Text style={styles.loginTitle}>Welcome back!</Text>
            <Text style={styles.loginSubtitle}>Sign in to continue</Text>
            <TextInput
              placeholder="Email address"
              placeholderTextColor="#A9A9A9"
              style={styles.loginInput}
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#A9A9A9"
              style={styles.loginInput}
              onChangeText={setPassword}
              value={password}
              secureTextEntry
            />
            <Pressable
              onPress={handleLoginPress}
              style={({ pressed }) => [
                styles.loginButton,
                pressed && styles.loginButtonPressed,
              ]}
            >
              <Text style={styles.loginButtonText}>Log In</Text>
            </Pressable>
            <Pressable>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </Pressable>
          </>
        ) : (
          // Registration Form
          <>
            <Text style={styles.loginTitle}>Create an account</Text>
            <Text style={styles.loginSubtitle}>
              Start tracking your expenses
            </Text>
            <TextInput
              placeholder="Email address"
              placeholderTextColor="#A9A9A9"
              style={styles.loginInput}
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#A9A9A9"
              style={styles.loginInput}
              onChangeText={setPassword}
              value={password}
              secureTextEntry
            />
            <Pressable
              onPress={handleRegisterPress}
              style={({ pressed }) => [
                styles.loginButton,
                pressed && styles.loginButtonPressed,
              ]}
            >
              <Text style={styles.loginButtonText}>Register</Text>
            </Pressable>
            <Pressable onPress={toggleView}>
              <Text style={styles.forgotPasswordText}>
                Already have an account? Log In
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  )
}

// --- Component: Home Screen ---
// This is the main dashboard for viewing expenses.
const HomeScreen = ({ expenses, onDelete }) => {
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.sectionTitle}>Your Expenses</Text>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExpenseItem
            title={item.title}
            amount={item.amount}
            date={item.date}
            onDelete={() => onDelete(item.id)}
          />
        )}
      />
      <Pressable
        onPress={() => setModalVisible(true)}
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.addButtonPressed,
        ]}
      >
        <Text style={styles.addButtonText}>Add New Expense</Text>
      </Pressable>
      <AddExpenseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddExpense={() => {
          // Add expense logic would go here, which is now handled by the parent App component
          setModalVisible(false)
        }}
      />
    </View>
  )
}

// --- Component: Expense Item ---
// A single item in the expense list.
const ExpenseItem = ({ title, amount, date, onDelete }) => {
  return (
    <View style={styles.expenseItem}>
      <View style={styles.expenseItemDetails}>
        <Text style={styles.expenseItemTitle}>{title}</Text>
        <Text style={styles.expenseItemDate}>{date}</Text>
      </View>
      <View style={styles.expenseItemInfo}>
        <Text style={styles.expenseItemAmount}>${amount.toFixed(2)}</Text>
        <Pressable
          onPress={onDelete}
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && styles.deleteButtonPressed,
          ]}
        >
          <Text style={styles.deleteButtonText}>X</Text>
        </Pressable>
      </View>
    </View>
  )
}

// --- Component: Add Expense Modal ---
// The form for adding a new expense, displayed in a modal.
const AddExpenseModal = ({ visible, onClose, onAddExpense }) => {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')

  const handleAdd = () => {
    if (title.trim().length > 0 && amount.trim().length > 0) {
      onAddExpense(title, amount)
      setTitle('')
      setAmount('')
    }
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Expense</Text>
          <TextInput
            placeholder="Title"
            style={styles.input}
            onChangeText={setTitle}
            value={title}
          />
          <TextInput
            placeholder="Amount"
            style={styles.input}
            onChangeText={setAmount}
            value={amount}
            keyboardType="numeric"
          />
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.cancelButtonPressed,
              ]}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleAdd}
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.saveButtonPressed,
              ]}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

// --- Stylesheet ---
// Updated to reflect the login page design.
const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#121212', // A darker background for the main app
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#EFEFEF',
    marginBottom: 20,
    textAlign: 'center',
  },
  screenContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#EFEFEF',
    marginBottom: 10,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E1E1E', // Match login card
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  expenseItemDetails: {
    flex: 1,
    marginRight: 10,
  },
  expenseItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expenseItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EFEFEF',
  },
  expenseItemDate: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  expenseItemAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CDA64', // A nice green color
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#FF3B30', // A red color
    borderRadius: 50,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonPressed: {
    opacity: 0.8,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007AFF', // A blue color
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonPressed: {
    opacity: 0.8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#2C2C2E',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EFEFEF',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#3A3A3C',
    color: '#EFEFEF',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#8E8E93',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonPressed: {
    opacity: 0.8,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  saveButtonPressed: {
    opacity: 0.8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 50,
  },
  // --- New Styles for Login Page ---
  loginPageContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loginCard: {
    width: '100%',
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EFEFEF',
    marginBottom: 5,
    textAlign: 'center',
  },
  loginSubtitle: {
    fontSize: 16,
    color: '#A9A9A9',
    marginBottom: 30,
    textAlign: 'center',
  },
  loginInput: {
    backgroundColor: '#2C2C2C',
    color: '#EFEFEF',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonPressed: {
    opacity: 0.8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 20,
  },
  // New styles for the tabbed interface
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
    marginBottom: 25,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#1E1E1E',
  },
  tabText: {
    color: '#A9A9A9',
    fontWeight: 'bold',
    fontSize: 16,
  },
  activeTabText: {
    color: '#EFEFEF',
  },
})

export default App
