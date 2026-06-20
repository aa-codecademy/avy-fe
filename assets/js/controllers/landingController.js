/**
 * Landing Page Controller
 */
import authService from '../services/authService.js';

export default async function landingPageController() {
    const app = document.getElementById('app');
    
    // Check if user is already logged in
    if (authService.isAuthenticated()) {
        window.router.navigate('/dashboard');
        return;
    }
    
    app.innerHTML = `
        <!-- Navigation -->
        <nav class="bg-white shadow-md">
            <div class="w-full max-w-[1200px] mx-auto px-4 py-4">
                <div class="flex justify-between items-center">
                    <a href="/" data-link class="flex items-center space-x-2 hover:opacity-90">
                        <span class="text-2xl font-bold text-[#dd2c00]">Avy</span>
                        <span class="text-sm text-gray-500">by Avenga Academy</span>
                    </a>
                    <div class="space-x-4">
                        <a href="/login" data-link class="text-gray-600 hover:text-[#dd2c00] transition">Login</a>
                        <a href="/login" data-link class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 bg-gradient-to-r from-[#dd2c00] to-[#0257b4] text-white hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(221,44,0,0.3)]">Get Started</a>
                    </div>
                </div>
            </div>
        </nav>
        
        <!-- Hero Section -->
        <section class="bg-[linear-gradient(135deg,#dd2c00_0%,#b02400_100%)] text-white py-20">
            <div class="w-full max-w-[1200px] mx-auto px-4 text-center fade-in">
                <h1 class="text-5xl md:text-6xl font-bold mb-6">
                    Connect Students with <br>
                    <span class="text-orange-400">Career Opportunities</span>
                </h1>
                <p class="text-xl md:text-2xl mb-8 opacity-90">
                    Bridge the gap between education and employment with Avy
                </p>
                <div class="space-x-4">
                    <a href="/login" data-link class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 bg-white hover:bg-gray-100 text-[#dd2c00]">
                        <i class="fas fa-user-graduate mr-2"></i>
                        I'm a Student
                    </a>
                    <a href="/login" data-link class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 bg-[#0257b4] text-white hover:opacity-90">
                        <i class="fas fa-building mr-2"></i>
                        I'm an Employer
                    </a>
                </div>
            </div>
        </section>
        
        <!-- Features Section -->
        <section class="py-20 bg-gray-50">
            <div class="w-full max-w-[1200px] mx-auto px-4">
                <h2 class="text-4xl font-bold text-center mb-12 text-gray-800">Three Powerful Modules</h2>
                <div class="grid md:grid-cols-3 gap-8">
                    <!-- Bloom Module -->
                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] text-center">
                        <div class="text-5xl mb-4">🌱</div>
                        <h3 class="text-2xl font-bold mb-4 text-[#dd2c00]">Bloom</h3>
                        <p class="text-gray-600 mb-4">Student & Alumni Platform</p>
                        <ul class="text-left space-y-2 text-gray-700">
                            <li><i class="fas fa-check text-green-500 mr-2"></i>Build your profile</li>
                            <li><i class="fas fa-check text-green-500 mr-2"></i>Browse job opportunities</li>
                            <li><i class="fas fa-check text-green-500 mr-2"></i>Apply with one click</li>
                            <li><i class="fas fa-check text-green-500 mr-2"></i>Track applications</li>
                        </ul>
                    </div>
                    
                    <!-- Evergreen Module -->
                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] text-center">
                        <div class="text-5xl mb-4">🏢</div>
                        <h3 class="text-2xl font-bold mb-4 text-[#dd2c00]">Evergreen</h3>
                        <p class="text-gray-600 mb-4">Company Platform</p>
                        <ul class="text-left space-y-2 text-gray-700">
                            <li><i class="fas fa-check text-green-500 mr-2"></i>Post job openings</li>
                            <li><i class="fas fa-check text-green-500 mr-2"></i>Review candidates</li>
                            <li><i class="fas fa-check text-green-500 mr-2"></i>Manage applications</li>
                            <li><i class="fas fa-check text-green-500 mr-2"></i>Find top talent</li>
                        </ul>
                    </div>
                    
                    <!-- Meridian Module -->
                    <div class="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)] text-center">
                        <div class="text-5xl mb-4">⚙️</div>
                        <h3 class="text-2xl font-bold mb-4 text-[#dd2c00]">Meridian</h3>
                        <p class="text-gray-600 mb-4">Admin Platform</p>
                        <ul class="text-left space-y-2 text-gray-700">
                            <li><i class="fas fa-check text-green-500 mr-2"></i>Manage users</li>
                            <li><i class="fas fa-check text-green-500 mr-2"></i>Oversee postings</li>
                            <li><i class="fas fa-check text-green-500 mr-2"></i>Analytics dashboard</li>
                            <li><i class="fas fa-check text-green-500 mr-2"></i>System configuration</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- Stats Section -->
        <section class="py-20">
            <div class="w-full max-w-[1200px] mx-auto px-4">
                <div class="grid md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div class="text-5xl font-bold mb-2 text-[#dd2c00]">500+</div>
                        <div class="text-gray-600">Students</div>
                    </div>
                    <div>
                        <div class="text-5xl font-bold mb-2 text-[#0257b4]">100+</div>
                        <div class="text-gray-600">Companies</div>
                    </div>
                    <div>
                        <div class="text-5xl font-bold mb-2 text-[#dd2c00]">250+</div>
                        <div class="text-gray-600">Job Postings</div>
                    </div>
                    <div>
                        <div class="text-5xl font-bold mb-2 text-[#0257b4]">85%</div>
                        <div class="text-gray-600">Success Rate</div>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- CTA Section -->
        <section class="bg-[linear-gradient(135deg,#dd2c00_0%,#b02400_100%)] text-white py-16">
            <div class="w-full max-w-[1200px] mx-auto px-4 text-center">
                <h2 class="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
                <p class="text-xl mb-8">Join Avy today and connect with opportunities</p>
                <a href="/login" data-link class="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-semibold no-underline transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 bg-white hover:bg-gray-100 text-[#dd2c00] text-lg px-8 py-4">
                    Get Started Now <i class="fas fa-arrow-right ml-2"></i>
                </a>
            </div>
        </section>
        
        <!-- Footer -->
        <footer class="bg-gray-800 text-white py-8">
            <div class="w-full max-w-[1200px] mx-auto px-4 text-center">
                <p>&copy; 2025 Avy. Code Academy Student Project.</p>
                <p class="text-gray-400 mt-2">Phase 1: Frontend Only (Feb-May 2026)</p>
            </div>
        </footer>
    `;
}
