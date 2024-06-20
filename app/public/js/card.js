function toggleLikeIcon() {
    const heartIcon = document.querySelector('.artContainerIcons[src*="heart.svg"]');
    if (heartIcon) {
      const newSrc = heartIcon.src.replace('heart.svg', 'filledHeart.svg');
      heartIcon.src = newSrc;
    }
  }
  
  // Add event listener to the like icon container (or desired element)
  const likeContainer = document.querySelector('.gridContainerLikeAndCard');
  likeContainer.addEventListener('click', toggleLikeIcon);
  