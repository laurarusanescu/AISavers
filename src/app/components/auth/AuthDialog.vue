<template>
  <Dialog :title="t('navigation.auth.title')" @close="emit('close')">
    <template #default>
      <!-- Mode tabs -->
      <div class="auth-tabs">
        <button 
          :class="{ active: mode === 'login' }"
          @click="mode = 'login'"
        >
          {{ t('navigation.auth.login') }}
        </button>
        <button 
          :class="{ active: mode === 'signup' }"
          @click="mode = 'signup'"
        >
          {{ t('navigation.auth.signup') }}
        </button>
        <button 
          :class="{ active: mode === 'forgot' }"
          @click="mode = 'forgot'"
        >
          {{ t('navigation.auth.forgotPassword') }}
        </button>
      </div>

      <!-- Forms -->
      <div class="auth-forms">
        <!-- Login Form -->
        <Form v-if="mode === 'login'" @submit="handleLogin" class="auth-form">
          <Alert v-if="loginError" type="error" :text="loginError" />
          
          <TextField
            v-model="loginForm.username"
            :label="t('navigation.auth.username')"
            required
          />
          
          <TextField
            v-model="loginForm.password"
            :label="t('navigation.auth.password')"
            type="password"
            required
          />
          
          <CheckBox
            v-model="loginForm.rememberMe"
            :label="t('navigation.auth.rememberMe')"
          />
          
          <Button 
            type="submit" 
            :text="t('navigation.auth.login')"
            color="primary"
            class="submit-button"
            :loading="isLoading"
          >
            <template #default>
              <span>{{ t('navigation.auth.login') }}</span>
              <div v-if="isLoading" class="loading-bar"></div>
            </template>
          </Button>
        </Form>

        <!-- Signup Form -->
        <Form v-if="mode === 'signup'" @submit="handleSignup" class="auth-form">
          <Alert v-if="signupError" type="error" :text="signupError" />
          
          <TextField
            v-model="signupForm.username"
            :label="t('navigation.auth.username')"
            required
          />
          
          <TextField
            v-model="signupForm.email"
            :label="t('navigation.auth.email')"
            type="email"
            required
          />
          
          <TextField
            v-model="signupForm.password"
            :label="t('navigation.auth.password')"
            type="password"
            required
          />
          
          <TextField
            v-model="signupForm.confirmPassword"
            :label="t('navigation.auth.confirmPassword')"
            type="password"
            required
          />
          
          <Button 
            type="submit" 
            :text="t('navigation.auth.signup')"
            color="primary"
            class="submit-button"
          />
        </Form>

        <!-- Forgot Password Form -->
        <Form v-if="mode === 'forgot'" @submit="handleForgotPassword" class="auth-form">
          <Alert v-if="forgotError" type="error" :text="forgotError" />
          <Alert v-if="forgotSuccess" type="success" :text="t('navigation.auth.resetPasswordSuccess')" />
          
          <TextField
            v-model="forgotForm.email"
            :label="t('navigation.auth.email')"
            type="email"
            required
          />
          
          <Button 
            type="submit" 
            :text="t('navigation.auth.resetPassword')"
            color="primary"
            class="submit-button"
            :loading="isLoading"
          >
            <template #default>
              <span>{{ t('navigation.auth.resetPassword') }}</span>
              <div v-if="isLoading" class="loading-bar"></div>
            </template>
          </Button>
        </Form>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useStorage } from '@storage/index';
import { ref, reactive } from 'vue';
import Alert from '@components/base/alert/Alert.vue';
import Dialog from '@components/base/dialog/Dialog.vue';
import Form from '@components/base/form/Form.vue';
import TextField from '@components/base/text-field/TextField.vue';
import Button from '@components/base/button/Button.vue';
import CheckBox from '@components/base/check-box/CheckBox.vue';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const { t } = useI18n();
const { login, signup, resetPassword } = useStorage();

// Auth mode state
const mode = ref<'login' | 'signup' | 'forgot'>('login');

// Form states
const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false
});

const signupForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const forgotForm = reactive({
  email: ''
});

// Error states
const loginError = ref('');
const signupError = ref('');
const forgotError = ref('');
const forgotSuccess = ref(false);

// Loading state
const isLoading = ref(false);

// Form handlers
const handleLogin = async () => {
  loginError.value = '';
  isLoading.value = true;
  
  try {
    const success = await login(loginForm.username, loginForm.password, loginForm.rememberMe);
    if (success) {
      emit('close');
    } else {
      loginError.value = t('navigation.auth.loginFailed');
    }
  } catch (error) {
    loginError.value = t('navigation.auth.unknownError');
  } finally {
    isLoading.value = false;
  }
};

const handleSignup = async () => {
  signupError.value = '';
  isLoading.value = true;

  if (signupForm.password !== signupForm.confirmPassword) {
    signupError.value = t('navigation.auth.passwordsDoNotMatch');
    isLoading.value = false;
    return;
  }

  try {
    const success = await signup(signupForm.username, signupForm.email, signupForm.password);
    if (success) {
      emit('close');
    } else {
      signupError.value = t('navigation.auth.signupFailed');
    }
  } catch (error: any) {
    if (error.status === 409) {
      signupError.value = t('navigation.admin.conflict');
    } else {
      signupError.value = t('navigation.auth.unknownError');
    }
  } finally {
    isLoading.value = false;
  }
};

const handleForgotPassword = async () => {
  forgotError.value = '';
  forgotSuccess.value = false;
  isLoading.value = true;

  try {
    const success = await resetPassword(forgotForm.email);
    if (success) {
      forgotSuccess.value = true;
    } else {
      forgotError.value = t('navigation.auth.resetPasswordFailed');
    }
  } catch (error) {
    forgotError.value = t('navigation.auth.unknownError');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.auth-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  justify-content: center;
}

.auth-tabs button {
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  color: var(--text-color);
}

.auth-tabs button.active {
  border-bottom-color: var(--primary-color);
  color: var(--primary-color);
}

.auth-forms {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 1rem;
}

.auth-form {
  width: 100%;
  max-width: 320px;
}

:deep(.text-field) {
  width: 100%;
  margin-bottom: 1rem;
}

:deep(.check-box) {
  width: 100%;
  margin-bottom: 1rem;
}

.submit-button {
  width: 100%;
  margin-top: 1.5rem;
  text-align: center;
}

:deep(.button.submit-button) {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2.75rem;
  text-align: center;
}

:deep(.button.submit-button span) {
  width: 100%;
  text-align: center;
}

.loading-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: var(--color-primary);
  animation: loading 1.5s infinite ease-in-out;
}

@keyframes loading {
  0% {
    width: 0;
    left: 0;
  }
  50% {
    width: 100%;
    left: 0;
  }
  100% {
    width: 0;
    left: 100%;
  }
}
</style> 