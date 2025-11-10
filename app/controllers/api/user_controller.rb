# frozen_string_literal: true

class Api::UserController < ApplicationController
  before_action :authenticate, only: [:index, :create]
  protect_from_forgery with: :null_session
 
  def index
    users = User.all
    render json: users
  end

  def create
    @user = User.new(user_params)

    if @user.save
      render json: { status: 'success' }
    else
      render json: { status: 'failed' }, status: :unprocessable_content
    end
  end

  private

  def user_params
    params.permit(:email, :name, :password, :password_confirmation)
  end
end
