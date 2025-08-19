// Enhanced script to refresh LocalBase data with image fixes and Twitter -> X update
// Run this in browser console: refreshLocalBaseData()

window.refreshLocalBaseData = async function() {
  console.log('🔄 Refreshing LocalBase data with image fixes...');
  
  // Clear existing data to force reload with new image URLs
  localStorage.removeItem('localbase_businesses');
  localStorage.removeItem('localbase_reviews');
  localStorage.removeItem('localbase_posts');
  
  console.log('✅ Cleared existing data');
  console.log('🆕 Loading updated data with:');
  console.log('   🖼️ Real image URLs instead of emojis for better previews');
  console.log('   🐦 Twitter updated to X with proper styling');
  console.log('   🔧 Next.js Image optimization enabled for all external images');
  console.log('   📱 Better mobile responsiveness for image viewing');
  console.log('   ⚡ Faster loading with optimized image domains');
  
  alert('✅ LocalBase data refreshed! New businesses will now show real images.');
  
  // Refresh the page to load new data
  window.location.reload();
};

// Auto-expose the function
console.log('💡 To refresh LocalBase data with image fixes, run: refreshLocalBaseData()');

// Also provide direct command
console.log('🔄 Quick refresh: localStorage.clear(); location.reload();');
