class Klacht < ApplicationRecord
  has_one_attached :image
  
  STATUSES = %w[open in_progress completed].freeze

  validates :status, inclusion: { in: STATUSES }

  scope :uncompleted, -> { where.not(status: 'completed') }
end
