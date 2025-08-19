// Temporary script to refresh LocalBase data with correct ratings and hours
// Run this in browser console: window.refreshLocalBaseData()

window.refreshLocalBaseData = async function() {
  console.log('🔄 Refreshing LocalBase data...');
  
  // Clear existing data
  localStorage.removeItem('localbase_businesses');
  localStorage.removeItem('localbase_reviews');
  localStorage.removeItem('localbase_posts');
  
  console.log('✅ Cleared existing data');
  console.log('🔄 Please refresh the page to load new data with:');
  console.log('   - Correct rating display (using averageRating instead of reputationScore)');
  console.log('   - Proper business hours (LocalBase now shows "Open 24 hours")');
  console.log('   - LocalBase business with 5.0 star rating from review');
  
  // Refresh the page
  window.location.reload();
};

console.log('💡 To refresh LocalBase data with fixes, run: refreshLocalBaseData()');
