#!/usr/bin/env python3
"""
Individual Security Fixes Test - Testing each fix separately
"""

import requests
import json
import time
import sys
from datetime import datetime

# Backend configuration
BACKEND_URL = "https://build-begins.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"

# Test credentials
ADMIN_EMAIL = "admin@medequipmart.com"
ADMIN_PASSWORD = "admin123"
TEST_USER_EMAIL = "hospital@example.com"
TEST_USER_PASSWORD = "demo123"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_test_header(test_name):
    print(f"\n{Colors.BLUE}{Colors.BOLD}{'='*80}{Colors.ENDC}")
    print(f"{Colors.BLUE}{Colors.BOLD}Testing: {test_name}{Colors.ENDC}")
    print(f"{Colors.BLUE}{Colors.BOLD}{'='*80}{Colors.ENDC}")

def print_success(message):
    print(f"{Colors.GREEN}✅ PASS: {message}{Colors.ENDC}")

def print_error(message):
    print(f"{Colors.RED}❌ FAIL: {message}{Colors.ENDC}")

def print_info(message):
    print(f"{Colors.BLUE}ℹ️  INFO: {message}{Colors.ENDC}")

def test_c03_rate_limiting():
    """Test C-03: Rate limiting on auth endpoints"""
    print_test_header("C-03: Rate Limiting on Auth")
    
    print_info("Testing rate limiting with fresh IP/session...")
    
    # Use a different email to avoid conflicts
    login_data = {
        "email": "nonexistent@ratelimitest.com",
        "password": "wrongpassword"
    }
    
    rate_limited = False
    attempts = 0
    
    for i in range(8):  # Try 8 times
        attempts += 1
        print_info(f"Login attempt {i+1}/8...")
        
        try:
            response = requests.post(f"{API_BASE}/auth/login", json=login_data, timeout=10)
            
            if response.status_code == 429:  # Too Many Requests
                print_success(f"Rate limiting activated after {i+1} attempts")
                rate_limited = True
                break
            elif response.status_code == 401:  # Unauthorized (expected for wrong credentials)
                print_info(f"Attempt {i+1}: Unauthorized (expected)")
            else:
                print_info(f"Attempt {i+1}: Status {response.status_code}")
            
            time.sleep(0.5)  # Small delay between requests
            
        except requests.exceptions.RequestException as e:
            print_error(f"Request failed: {e}")
            break
    
    if rate_limited:
        return True
    else:
        # Check if we got rate limited in the error response
        try:
            response = requests.post(f"{API_BASE}/auth/login", json=login_data, timeout=10)
            if "rate limit" in response.text.lower():
                print_success("Rate limiting is active (detected in response)")
                return True
        except:
            pass
        
        print_error(f"Rate limiting not activated after {attempts} attempts")
        return False

def test_c02_email_removed():
    """Test C-02: Email removed from public reviews"""
    print_test_header("C-02: Email Removed from Public Reviews")
    
    try:
        # Test featured reviews
        print_info("Testing GET /api/reviews/featured...")
        response = requests.get(f"{API_BASE}/reviews/featured", timeout=10)
        
        if response.status_code == 200:
            reviews = response.json()
            email_found = False
            
            for review in reviews:
                user_data = review.get('user', {})
                if 'email' in user_data:
                    email_found = True
                    print_error(f"Email found in featured reviews: {user_data.get('email')}")
                    return False
            
            print_success("No email addresses found in featured reviews")
            return True
        else:
            print_error(f"Featured reviews endpoint failed: {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Test failed: {e}")
        return False

def test_c04_cloudinary_auth():
    """Test C-04: Cloudinary requires authentication"""
    print_test_header("C-04: Cloudinary Requires Authentication")
    
    try:
        # Test without auth
        print_info("Testing GET /api/cloudinary/signature without authentication...")
        response = requests.get(f"{API_BASE}/cloudinary/signature", timeout=10)
        
        if response.status_code == 401:
            print_success("Cloudinary endpoint correctly requires authentication")
            return True
        else:
            print_error(f"Cloudinary endpoint should return 401, got {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Test failed: {e}")
        return False

def test_m02_regex_escape():
    """Test M-02: Regex escape in search"""
    print_test_header("M-02: Regex Escape in Search")
    
    try:
        print_info("Testing GET /api/products?search=.* (regex injection attempt)...")
        response = requests.get(f"{API_BASE}/products?search=.*", timeout=10)
        
        if response.status_code == 200:
            products = response.json()
            
            if len(products) == 0:
                print_success("Regex properly escaped - no products returned for '.*' search")
                return True
            elif len(products) < 3:  # Very few results
                print_success(f"Regex appears escaped - only {len(products)} products returned")
                return True
            else:
                print_error(f"Regex not escaped - returned {len(products)} products")
                return False
        else:
            print_error(f"Search endpoint failed: {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Test failed: {e}")
        return False

def test_m03_password_strength():
    """Test M-03: Password strength validation"""
    print_test_header("M-03: Password Strength Validation")
    
    try:
        print_info("Testing POST /api/auth/register with weak password...")
        
        weak_password_data = {
            "email": f"weaktest{int(time.time())}@example.com",  # Unique email
            "name": "Weak Password Test",
            "password": "123456",  # Weak password
            "phone": "9876543299"
        }
        
        response = requests.post(f"{API_BASE}/auth/register", json=weak_password_data, timeout=10)
        
        if response.status_code == 400:
            error_message = response.json().get('detail', '')
            if "password" in error_message.lower():
                print_success("Password strength validation working")
                return True
            else:
                print_error(f"Wrong error message: {error_message}")
                return False
        elif response.status_code == 200:
            print_error("Weak password was accepted")
            return False
        else:
            print_error(f"Unexpected response: {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Test failed: {e}")
        return False

def main():
    """Run individual security tests"""
    print(f"{Colors.BOLD}Alaxico Security Fixes - Individual Tests{Colors.ENDC}")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Testing started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Run tests that don't require authentication first
    tests = [
        ("C-02: Email Removed from Reviews", test_c02_email_removed),
        ("C-04: Cloudinary Requires Auth", test_c04_cloudinary_auth),
        ("M-02: Regex Escape", test_m02_regex_escape),
        ("M-03: Password Strength", test_m03_password_strength),
        ("C-03: Rate Limiting on Auth", test_c03_rate_limiting),  # This one last as it may trigger rate limits
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
            time.sleep(1)  # Small delay between tests
        except Exception as e:
            print_error(f"Test {test_name} failed with exception: {e}")
            results.append((test_name, False))
    
    # Print summary
    print_test_header("Individual Security Tests Summary")
    
    passed = 0
    failed = 0
    
    for test_name, result in results:
        if result:
            print_success(f"{test_name}: PASS")
            passed += 1
        else:
            print_error(f"{test_name}: FAIL")
            failed += 1
    
    print(f"\n{Colors.BOLD}Results:{Colors.ENDC}")
    print(f"{Colors.GREEN}Passed: {passed}{Colors.ENDC}")
    print(f"{Colors.RED}Failed: {failed}{Colors.ENDC}")
    
    return failed == 0

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)