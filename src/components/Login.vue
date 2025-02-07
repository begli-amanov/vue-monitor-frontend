<script setup lang="js">
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import { ref } from 'vue'

const checked = ref(true)
</script>

<template>
  <div class="wrapper">
    <div class="bg-surface-950 px-6 py-20 md:px-12 lg:px-20">
      <div class="bg-surface-900 p-6 shadow rounded-border login-form">
        <div class="text-center">
          <div class="text-surface-50 text-3xl font-medium mt-2 mb-4">Welcome Back</div>
        </div>

        <div>
          <label for="email" class="text-surface-50 font-medium mb-2 block">Email</label>
          <InputText id="email" type="text" placeholder="Email address" class="w-full mb-4" />

          <label for="password" class="text-surface-50 font-medium mb-2 block">Password</label>
          <Password
            type="text"
            placeholder="Password"
            :feedback="false"
            toggleMask
            fluid
            class="w-full mb-4"
          />

          <div class="flex items-center justify-between mb-12">
            <div class="flex items-center">
              <Checkbox id="remember" v-model="checked" :binary="true" class="mr-2" />
              <label for="remember">Remember me</label>
            </div>
            <a class="font-medium no-underline ml-2 text-primary text-right cursor-pointer"
              >Forgot password?</a
            >
          </div>

          <RouterLink to="/">
            <Button label="Sign In" icon="pi pi-sign-in" class="w-full" />
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
