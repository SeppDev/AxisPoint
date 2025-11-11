# frozen_string_literal: true

class Api::UserController < ApplicationController
  before_action :authenticate, only: %i[index create destroy]
  protect_from_forgery with: :null_session

  def index
    users = User.all
    render json: users
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)

    if @user.save
      render json: { status: 'success' }
    else
      render json: { status: 'failed', errors: @user.errors.full_messages }, status: :unprocessable_content
    end
  end

  def destroy
    user = Current.user
    user.destroy!
  end

  private

  def user_params
    params.permit(:email, :name, :password, :password_confirmation)
  end
end
