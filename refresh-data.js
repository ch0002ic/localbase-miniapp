// Enhanced script to refresh LocalBase data with improved consistency
// Run this in browser console: window.refreshLocalBaseData()

window.refreshLocalBaseData = async function() {
  console.log('🔄 Refreshing LocalBase data with improvements...');
  
  // Clear existing data
  localStorage.removeItem('localbase_businesses');
  localStorage.removeItem('localbase_reviews');
  localStorage.removeItem('localbase_posts');
  
  console.log('✅ Cleared existing data');
  console.log('🆕 Loading improved data with:');
  console.log('   ✨ Fixed rating display (--/No reviews yet for 0 reviews)');
  console.log('   🎨 Color-coded ratings (green=excellent, yellow=good, red=poor)');
  console.log('   🏷️ Demo badges for example businesses');
  console.log('   📍 McDonald\'s @ NTU with realistic "No reviews yet" state');
  console.log('   🔧 TechMart Base with 5.0 rating from 2 reviews');
  console.log('   🌟 Consistent star colors and status indicators');
  console.log('   💰 Improved payment UX with live USD conversion');
  
  // Refresh the page
  window.location.reload();
};

console.log('💡 To refresh LocalBase data with all improvements, run: refreshLocalBaseData()');
