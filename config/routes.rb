# frozen_string_literal: true

Rails.application.routes.draw do
  get  'login', to: 'sessions#new', as: :sign_in
  post 'login', to: 'sessions#create'
  get 'users', to: 'users#index'
  post 'users', to: 'users#create'

  resources :sessions, only: [:destroy]
  resource :users, only: [:destroy]

  namespace :identity do
    resource :email_verification, only: %i[show create]
    resource :password_reset,     only: %i[new edit create update]
  end

  get :dashboard, to: 'dashboard#index'

  namespace :settings do
    resource :profile, only: %i[show update]
    resource :password, only: %i[show update]
    resource :email, only: %i[show update]
    resources :sessions, only: [:index]
    inertia :appearance
  end

  root 'home#index'

  get :sigma, to: 'sigma#index'
  get :melden, to: 'melden#index'

  get '/dashboard/klacht/:slug', to: 'dashboard/klacht#show', as: :klachtpage
  get '/dashboard/klacht', to: 'dashboard/klacht#index', as: :klachten

  namespace :api do
    resources :klacht, only: %i[create index destroy update]
    resources :user, only: %i[index create new]
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get 'up' => 'rails/health#show', as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
end
