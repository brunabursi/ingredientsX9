require 'json'
package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = "OCRModuleIos"
  s.version      = package['version']
  s.summary      = "OCR Module using Apple's Vision framework"
  s.description  = "Native OCR implementation for React Native using Vision framework"
  s.homepage     = package['homepage'] || "https://github.com/yourusername/ingredientsX9"
  s.license      = package['license']
  s.author       = { "Your Name" => "your.email@example.com" }
  s.platform     = :ios, "11.0"
  s.source       = { :git => "https://github.com/yourusername/ingredientsX9.git", :tag => "#{s.version}" }
  s.source_files = "ios/OCRModuleIos.{h,m,swift}"
  s.requires_arc = true
  s.dependency "React-Core"
  s.frameworks = "Vision"
  s.swift_version = '5.0'
end